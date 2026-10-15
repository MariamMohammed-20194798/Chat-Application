"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendEmailHook = void 0;
const standardwebhooks_1 = require("standardwebhooks");
const mailer_1 = require("../lib/mailer");
const emailTemplates_1 = require("../lib/emailTemplates");
const allowedActions = new Set(emailTemplates_1.ALLOWED_EMAIL_ACTIONS);
const hookSecret = () => {
    var _a;
    const raw = (_a = process.env.SEND_EMAIL_HOOK_SECRET) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw) {
        throw new Error("SEND_EMAIL_HOOK_SECRET is not set");
    }
    return raw.replace(/^v1,/, "");
};
const defaultClientUrl = () => process.env.CLIENT_URL || "http://localhost:3000";
const sanitizeRedirectTo = (redirectTo) => {
    const fallback = defaultClientUrl();
    if (!redirectTo)
        return fallback;
    const allowedOrigins = [fallback, "http://localhost:3000"];
    try {
        const parsed = new URL(redirectTo);
        if (!["http:", "https:"].includes(parsed.protocol))
            return fallback;
        if (allowedOrigins.some((origin) => redirectTo.startsWith(origin))) {
            return redirectTo;
        }
    }
    catch (_a) {
        return fallback;
    }
    return fallback;
};
const buildVerifyUrl = (tokenHash, actionType, redirectTo) => {
    const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
    const params = new URLSearchParams({
        token: tokenHash,
        type: actionType,
        redirect_to: redirectTo,
    });
    return `${supabaseUrl}/auth/v1/verify?${params.toString()}`;
};
const sendOneEmail = async (options) => {
    const confirmationUrl = buildVerifyUrl(options.tokenHash, options.actionType, options.redirectTo);
    const rendered = (0, emailTemplates_1.renderAuthEmail)({
        actionType: options.actionType,
        confirmationUrl,
        otp: options.otp,
        username: options.username,
    });
    await (0, mailer_1.getMailer)().sendMail({
        from: (0, mailer_1.getFromAddress)(),
        to: options.to,
        subject: rendered.subject,
        text: rendered.text,
        html: rendered.html,
    });
};
const handleSendEmailHook = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        if (!(0, mailer_1.isMailerConfigured)()) {
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
        const webhook = new standardwebhooks_1.Webhook(hookSecret());
        const payload = webhook.verify(rawBody, headers);
        const email = (_b = (_a = payload.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
        const actionType = (_c = payload.email_data) === null || _c === void 0 ? void 0 : _c.email_action_type;
        const tokenHash = (_d = payload.email_data) === null || _d === void 0 ? void 0 : _d.token_hash;
        const otp = ((_e = payload.email_data) === null || _e === void 0 ? void 0 : _e.token) || "";
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
        const redirectTo = sanitizeRedirectTo((_f = payload.email_data) === null || _f === void 0 ? void 0 : _f.redirect_to);
        const username = (_h = (_g = payload.user) === null || _g === void 0 ? void 0 : _g.user_metadata) === null || _h === void 0 ? void 0 : _h.username;
        await sendOneEmail({
            to: email,
            actionType: actionType,
            tokenHash,
            otp,
            redirectTo,
            username,
        });
        const tokenHashNew = (_j = payload.email_data) === null || _j === void 0 ? void 0 : _j.token_hash_new;
        const newEmail = (_l = (_k = payload.user) === null || _k === void 0 ? void 0 : _k.new_email) === null || _l === void 0 ? void 0 : _l.trim().toLowerCase();
        if (tokenHashNew && newEmail) {
            await sendOneEmail({
                to: newEmail,
                actionType: "email_change_new",
                tokenHash: tokenHashNew,
                otp: ((_m = payload.email_data) === null || _m === void 0 ? void 0 : _m.token_new) || "",
                redirectTo,
                username,
            });
        }
        console.log("Auth email sent", { actionType, toDomain: email.split("@")[1] });
        return res.status(200).json({});
    }
    catch (error) {
        if (error instanceof standardwebhooks_1.WebhookVerificationError) {
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
exports.handleSendEmailHook = handleSendEmailHook;
