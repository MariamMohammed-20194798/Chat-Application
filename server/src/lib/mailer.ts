import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

const isConfigured = (): boolean => {
  if (!process.env.SMTP_USER) return false;
  if (process.env.GMAIL_REFRESH_TOKEN) {
    return Boolean(
      process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET,
    );
  }
  return Boolean(process.env.SMTP_PASS);
};

export const isMailerConfigured = isConfigured;

const createTransporter = (): Transporter => {
  if (process.env.GMAIL_REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  }

  const port = Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const getMailer = (): Transporter => {
  if (!isConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_USER and SMTP_PASS (App Password) or Gmail OAuth2 variables.",
    );
  }
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

export const getFromAddress = (): string => {
  const name = process.env.SMTP_FROM_NAME || "Chatty";
  const email = process.env.SMTP_FROM || process.env.SMTP_USER || "";
  return `${name} <${email}>`;
};
