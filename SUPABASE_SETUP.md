# Supabase Migration Setup

This project uses **Supabase PostgreSQL**, **Supabase Auth**, and **Socket.IO** (messages/presence). Authentication emails are sent with **Nodemailer** from the Express server after Supabase calls the **Send Email Hook**.

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Note **Project URL**, **anon key**, and **service role key** (Settings → API).

## 2. Run database migrations

In the Supabase **SQL Editor**, run in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`

Or with the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## 3. Configure Auth

In **Authentication → Providers → Email**:

- Enable the Email provider.
- Keep **Confirm email** enabled.
- Secure email change can stay enabled.

In **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:**  
  `http://localhost:3000/**`  
  `http://localhost:3000/login`  
  `http://localhost:3000/reset-password`

In production, replace those with your HTTPS frontend origin.

### Send Email Hook (required for Nodemailer)

Do **not** send a second confirmation email from `signUp()`. Supabase still creates the user and the confirmation token. The hook only replaces Supabase’s built-in mailer.

1. Deploy or tunnel the Express API so it has a public HTTPS URL.
2. Open **Authentication → Hooks** (sometimes listed as **Auth Hooks**).
3. Enable **Send Email hook**.
4. Choose **HTTPS** (not Postgres).
5. Set the URL to:

   ```text
   https://YOUR-PUBLIC-API-HOST/api/v1/auth/send-email
   ```

6. Generate the hook secret and copy the full value (`v1,whsec_...`) into `server/.env` as `SEND_EMAIL_HOOK_SECRET`.
7. Leave **Custom SMTP** disabled while the hook is enabled. The hook replaces built-in delivery. If both are misconfigured, signup fails with a confirmation-email error.

Local development: hosted Supabase cannot call localhost. Run a tunnel:

```bash
npx cloudflared tunnel --url http://localhost:8000
```

Use the `https://*.trycloudflare.com` (or ngrok) origin in the hook URL and keep the tunnel process running while you test.

The hook payload is verified with [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks). Unsigned callers cannot send mail. Confirmation OTPs and `token_hash` values are one-time secrets owned by Supabase; this app does not store or reuse them.

## 4. Server environment

Copy `server/.env.example` to `server/.env` and fill in:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLIENT_URL=http://localhost:3000
JWT_COOKIE_EXPIRES_IN=90
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=you@gmail.com
SMTP_FROM_NAME=Chatty
SEND_EMAIL_HOOK_SECRET=v1,whsec_...
CLOUD_NAME=...
API_KEY=...
API_SECRET=...
```

Gmail SMTP is for development. Before production, switch SMTP to a transactional provider and verify the sending domain with that provider. Nodemailer does not provide free delivery on its own.

Remove old MongoDB variables (`DATABASE`, `DATABASE_PASSWORD`) from `.env` unless running the migration script.

## 5. Install and run

```bash
cd server
npm install
npm run build
npm start
```

```bash
cd client
npm install
npm start
```

## 6. Migrate existing MongoDB data (optional)

```bash
cd scripts
npm install mongodb @supabase/supabase-js dotenv ts-node typescript
# Add DATABASE + DATABASE_PASSWORD to server/.env temporarily
npx ts-node migrate-mongo-to-supabase.ts
```

**Note:** Supabase Auth cannot import MongoDB `bcrypt` password hashes. Migrated users receive `MIGRATION_DEFAULT_PASSWORD` and should reset passwords.

## 7. Row Level Security

RLS is enabled on all tables. The **Express server** uses the **service role key** and bypasses RLS for API operations. Direct client access to Supabase must use the **anon key** + user JWT so RLS applies.

## 8. Realtime (optional)

Subscribe from the React client:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

supabase
  .channel("messages")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    (payload) => console.log(payload.new)
  )
  .subscribe();
```

Socket.IO remains the primary real-time path for this app.

## API compatibility

REST responses still use MongoDB-style `_id` fields so the React client requires no changes.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `profile not found` after signup | Run migrations; check `handle_new_user` trigger |
| 401 on protected routes | Confirm email, then log in; check the `jwt` cookie |
| Signup fails sending confirmation email | Public hook URL, matching `SEND_EMAIL_HOOK_SECRET`, working SMTP |
| Hook 401 | Raw JSON body + Standard Webhooks headers; secret includes `v1,whsec_` |
| Mail never arrives | Gmail App Password / provider domain verification; check spam |
| Reset page missing token | Add `/reset-password` to redirect URLs; open the latest email link |
| Room not found | Ensure both users exist in `profiles` |
| Realtime not firing | Enable Replication for `messages` in Database → Publications |
