"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAuthEmail = exports.ALLOWED_EMAIL_ACTIONS = void 0;
exports.ALLOWED_EMAIL_ACTIONS = [
    "signup",
    "recovery",
    "invite",
    "magiclink",
    "email_change",
    "email_change_new",
    "reauthentication",
];
const copy = {
    signup: {
        subject: "Confirm your Chatty email",
        heading: "Confirm your email address",
        body: "Thanks for joining Chatty. Confirm this address so you can start conversations with the people who matter to you.",
        cta: "Confirm email",
    },
    recovery: {
        subject: "Reset your Chatty password",
        heading: "Reset your password",
        body: "We received a request to reset the password for your Chatty account. Use the button below to choose a new one. If you did not ask for this, you can ignore this email.",
        cta: "Reset password",
    },
    invite: {
        subject: "You’re invited to Chatty",
        heading: "You’ve been invited",
        body: "Someone invited you to create a Chatty account. Accept the invitation to get started.",
        cta: "Accept invitation",
    },
    magiclink: {
        subject: "Your Chatty sign-in link",
        heading: "Sign in to Chatty",
        body: "Use this one-time link to sign in. It expires shortly and can only be used once.",
        cta: "Sign in",
    },
    email_change: {
        subject: "Confirm your new Chatty email",
        heading: "Confirm your new email",
        body: "Follow the link below to confirm this as your new Chatty email address. If you did not request this change, you can ignore this email.",
        cta: "Confirm new email",
    },
    email_change_new: {
        subject: "Confirm your new Chatty email",
        heading: "Confirm your new email",
        body: "Follow the link below to confirm this as your new Chatty email address. If you did not request this change, you can ignore this email.",
        cta: "Confirm new email",
    },
    reauthentication: {
        subject: "Your Chatty verification code",
        heading: "Your verification code",
        body: "Use the code below to verify it’s you. This code expires shortly and can only be used once.",
        cta: "Continue in Chatty",
    },
};
const escapeHtml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const renderAuthEmail = ({ actionType, confirmationUrl, otp, username, }) => {
    const content = copy[actionType];
    const greeting = username ? `Hi ${username},` : "Hi,";
    const safeUrl = escapeHtml(confirmationUrl);
    const safeOtp = escapeHtml(otp);
    const showLink = actionType !== "reauthentication";
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(content.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f7ff;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#201b35;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f7ff;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(109,5,237,0.08);">
            <tr>
              <td style="padding:28px 32px 12px;background:linear-gradient(100deg,#6d05ed 0%,#861fff 100%);">
                <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Chatty</p>
                <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;line-height:1.3;">${escapeHtml(content.heading)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 14px;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 22px;">${escapeHtml(content.body)}</p>
                ${showLink
        ? `<p style="margin:0 0 22px;text-align:center;">
                  <a href="${safeUrl}" style="display:inline-block;background:#6d05ed;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:700;">${escapeHtml(content.cta)}</a>
                </p>`
        : ""}
                <p style="margin:0 0 8px;font-size:13px;color:#888599;">You can also use this one-time code:</p>
                <p style="margin:0 0 22px;font-size:28px;letter-spacing:6px;font-weight:700;color:#6d05ed;">${safeOtp}</p>
                <p style="margin:0;font-size:12px;color:#888599;line-height:1.5;">This link and code expire shortly and can be used only once. Chatty never asks you to forward this email or share the code.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px;font-size:12px;color:#aaa7b5;">
                If the button does not work, copy and paste this URL into your browser:<br />
                <span style="word-break:break-all;color:#7623e8;">${safeUrl}</span>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:11px;color:#888599;">Sent by Chatty · If you did not create an account, you can ignore this message.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    const textLines = [
        greeting,
        "",
        content.body,
        "",
        showLink ? `${content.cta}: ${confirmationUrl}` : "",
        otp ? `One-time code: ${otp}` : "",
        "",
        "This link and code expire shortly and can be used only once.",
        "If you did not request this, you can ignore this email.",
    ].filter(Boolean);
    return {
        subject: content.subject,
        html,
        text: textLines.join("\n"),
    };
};
exports.renderAuthEmail = renderAuthEmail;
