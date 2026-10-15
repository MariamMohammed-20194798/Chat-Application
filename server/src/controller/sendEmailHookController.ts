import { RequestHandler } from "express";
import { Webhook, WebhookVerificationError } from "standardwebhooks";
import { getFromAddress, getMailer, isMailerConfigured } from "../lib/mailer";
import {
  ALLOWED_EMAIL_ACTIONS,
  EmailActionType,
  renderAuthEmail,
} from "../lib/emailTemplates";

interface SendEmailHookPayload {
  user?: {
    email?: string;
    user_metadata?: { username?: string };
    new_email?: string;
  };
  email_data?: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type?: string;
    site_url?: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

const allowedActions = new Set<string>(ALLOWED_EMAIL_ACTIONS);

const hookSecret = (): string => {
  const raw = process.env.SEND_EMAIL_HOOK_SECRET?.trim();
  if (!raw) {
    throw new Error("SEND_EMAIL_HOOK_SECRET is not set");
  }
  return raw.replace(/^v1,/, "");
};

const defaultClientUrl = (): string =>
  process.env.CLIENT_URL || "http://localhost:3000";

const sanitizeRedirectTo = (redirectTo: string | undefined): string => {
  const fallback = defaultClientUrl();
  if (!redirectTo) return fallback;
  const allowedOrigins = [fallback, "http://localhost:3000"];
  try {
    const parsed = new URL(redirectTo);
    if (!["http:", "https:"].includes(parsed.protocol)) return fallback;
    if (allowedOrigins.some((origin) => redirectTo.startsWith(origin))) {
      return redirectTo;
    }
  } catch {
    return fallback;
  }
  return fallback;
};

const buildVerifyUrl = (
  tokenHash: string,
  actionType: string,
  redirectTo: string,
): string => {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const params = new URLSearchParams({
    token: tokenHash,
    type: actionType,
    redirect_to: redirectTo,
  });
  return `${supabaseUrl}/auth/v1/verify?${params.toString()}`;
};

const sendOneEmail = async (options: {
  to: string;
  actionType: EmailActionType;
  tokenHash: string;
  otp: string;
  redirectTo: string;
  username?: string;
}): Promise<void> => {
  const confirmationUrl = buildVerifyUrl(
    options.tokenHash,
    options.actionType,
    options.redirectTo,
  );
  const rendered = renderAuthEmail({
    actionType: options.actionType,
    confirmationUrl,
    otp: options.otp,
    username: options.username,
  });

  await getMailer().sendMail({
    from: getFromAddress(),
    to: options.to,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  });
};

export const handleSendEmailHook: RequestHandler = async (req, res) => {
  try {
    if (!isMailerConfigured()) {
      return res.status(500).json({
        error: { message: "Email delivery is not configured on the server." },
      });
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : typeof req.body === "string"
        ? req.body
        : "";

    if (!rawBody) {
      return res.status(400).json({
        error: { message: "Missing request body." },
      });
    }

    const headers = {
      "webhook-id": String(req.header("webhook-id") || ""),
      "webhook-timestamp": String(req.header("webhook-timestamp") || ""),
      "webhook-signature": String(req.header("webhook-signature") || ""),
    };

    const webhook = new Webhook(hookSecret());
    const payload = webhook.verify(rawBody, headers) as SendEmailHookPayload;

    const email = payload.user?.email?.trim().toLowerCase();
    const actionType = payload.email_data?.email_action_type;
    const tokenHash = payload.email_data?.token_hash;
    const otp = payload.email_data?.token || "";

    if (!email || !actionType || !tokenHash) {
      return res.status(400).json({
        error: { message: "Invalid hook payload." },
      });
    }

    if (!allowedActions.has(actionType)) {
      return res.status(400).json({
        error: { message: "Unsupported email action." },
      });
    }

    const redirectTo = sanitizeRedirectTo(payload.email_data?.redirect_to);
    const username = payload.user?.user_metadata?.username;

    await sendOneEmail({
      to: email,
      actionType: actionType as EmailActionType,
      tokenHash,
      otp,
      redirectTo,
      username,
    });

    const tokenHashNew = payload.email_data?.token_hash_new;
    const newEmail = payload.user?.new_email?.trim().toLowerCase();
    if (tokenHashNew && newEmail) {
      await sendOneEmail({
        to: newEmail,
        actionType: "email_change_new",
        tokenHash: tokenHashNew,
        otp: payload.email_data?.token_new || "",
        redirectTo,
        username,
      });
    }

    console.log("Auth email sent", { actionType, toDomain: email.split("@")[1] });
    return res.status(200).json({});
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return res.status(401).json({
        error: { http_code: 401, message: "Invalid webhook signature." },
      });
    }

    console.error("Send email hook failed", {
      name: error instanceof Error ? error.name : "Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(500).json({
      error: {
        http_code: 500,
        message: "Failed to send authentication email.",
      },
    });
  }
};
