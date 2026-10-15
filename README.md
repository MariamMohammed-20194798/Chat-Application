# Chatty

Chatty is a real-time chat app. The React client talks to an Express API. **Supabase Auth** still owns signup, login, sessions, email confirmation, and password recovery. **Nodemailer** sends those authentication emails after a signed Supabase Send Email Hook calls the Express server.

Nodemailer is not a free inbox provider. It only delivers mail through an SMTP service you configure (Gmail App Password for local development, a dedicated provider with a verified domain in production).

## Architecture

- Client: React (Create React App) on `http://localhost:3000`
- API: Express + TypeScript + Socket.IO on `http://localhost:8000`
- Auth and data: Supabase Auth + PostgreSQL
- Auth emails: Supabase Send Email Hook → `POST /api/v1/auth/send-email` → Nodemailer SMTP

Signup, login, and logout still go through `/api/v1/users`. After signup, Supabase keeps the user unconfirmed until they click the email link (or enter the OTP). The Express app never generates confirmation tokens.

## Local setup

### 1. Environment files

Copy `server/.env.example` to `server/.env` and fill in real values. Never put SMTP passwords, hook secrets, or the Supabase service-role key in client code.

Required server variables:

| Variable | Where it is used |
| --- | --- |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Auth and database |
| `CLIENT_URL` | CORS and email `redirect_to` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Nodemailer |
| `SMTP_FROM`, `SMTP_FROM_NAME` | From header |
| `SEND_EMAIL_HOOK_SECRET` | Verifies the Supabase hook |

Optional Gmail OAuth2 instead of an App Password: `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`.

Optional client variables in `client/.env` (Realtime only): `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`.

### 2. Gmail SMTP (development)

Gmail is acceptable for local testing. It is not suitable for production (daily limits, spam filtering, and Google account policy).

1. Enable 2-Step Verification on the Google account.
2. Create an [App Password](https://myaccount.google.com/apppasswords) and store it in `SMTP_PASS`.
3. Set `SMTP_USER` / `SMTP_FROM` to that Gmail address.
4. Google may still block first-time SMTP from a new environment. Check the account’s security alerts if mail is refused.

Production needs a transactional provider (Resend, Postmark, SendGrid, or Amazon SES) and a **verified sending domain**. Point `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` at that provider. Do not keep Gmail as the production transport.

### 3. Database and Auth

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for migrations, Email provider settings, and the Send Email Hook.

### 4. Public URL for the hook (required locally)

Hosted Supabase cannot call `http://localhost:8000`. Tunnel the API, then paste the public HTTPS URL into the hook:

```bash
npx cloudflared tunnel --url http://localhost:8000
# or: ngrok http 8000
```

Hook URL:

```text
https://YOUR-TUNNEL/api/v1/auth/send-email
```

Keep the tunnel running while you test signup and password reset.

### 5. Run the app

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm start
```

## Testing

1. Sign up with a real inbox you can open. You should stay on the signup page with a “check your inbox” message (email confirmation stays enabled).
2. Open the Chatty confirmation email (HTML + plain text). Confirm with the button or paste the OTP in Supabase only if you are using the link flow.
3. Click **Confirm email**. You should land on `/login`. Sign in, then sign out from the app.
4. Use **Forgot your password?** and confirm the recovery email arrives through Nodemailer, not the default Supabase template. Set a new password on `/reset-password`.
5. Try signing in before confirming the address: you should see “Email not confirmed”.
6. A request to `POST /api/v1/auth/send-email` without a valid `webhook-signature` must return 401 and must not send mail.

## Production notes

- Deploy the Express API on HTTPS. Put that origin in the Send Email Hook URL.
- Add `https://your-frontend/login` and `https://your-frontend/reset-password` to Supabase redirect URLs.
- Replace Gmail with a provider that has a verified domain and production sending limits.
- Rotate `SEND_EMAIL_HOOK_SECRET` if it leaks. Never commit `.env`.

## Troubleshooting

| Issue | What to check |
| --- | --- |
| Signup returns 502 about confirmation email | Hook URL reachable from the internet, hook enabled, `SEND_EMAIL_HOOK_SECRET` matches the dashboard, SMTP credentials work |
| 401 from `/api/v1/auth/send-email` | Secret must be the full dashboard value (`v1,whsec_...`). The raw JSON body must not be parsed before signature verification |
| Email never arrives | Gmail App Password, “less secure” blocks, spam folder, or unverified production domain |
| Reset link does not open `/reset-password` | Add that path under Authentication → URL Configuration |
| Login works without confirming | Confirm email is still enabled on the Email provider |

More detail lives in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
