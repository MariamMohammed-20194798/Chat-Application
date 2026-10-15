"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromAddress = exports.getMailer = exports.isMailerConfigured = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = null;
const isConfigured = () => {
    if (!process.env.SMTP_USER)
        return false;
    if (process.env.GMAIL_REFRESH_TOKEN) {
        return Boolean(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET);
    }
    return Boolean(process.env.SMTP_PASS);
};
exports.isMailerConfigured = isConfigured;
const createTransporter = () => {
    if (process.env.GMAIL_REFRESH_TOKEN) {
        return nodemailer_1.default.createTransport({
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
    return nodemailer_1.default.createTransport({
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
const getMailer = () => {
    if (!isConfigured()) {
        throw new Error("SMTP is not configured. Set SMTP_USER and SMTP_PASS (App Password) or Gmail OAuth2 variables.");
    }
    if (!transporter) {
        transporter = createTransporter();
    }
    return transporter;
};
exports.getMailer = getMailer;
const getFromAddress = () => {
    const name = process.env.SMTP_FROM_NAME || "Chatty";
    const email = process.env.SMTP_FROM || process.env.SMTP_USER || "";
    return `${name} <${email}>`;
};
exports.getFromAddress = getFromAddress;
