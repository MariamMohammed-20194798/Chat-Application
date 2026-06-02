# Supabase Migration Setup

This project uses **Supabase PostgreSQL**, **Supabase Auth**, and **Socket.IO** (messages/presence). Supabase Realtime is enabled on the `messages` table for optional client subscriptions.

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

- Enable Email provider.
- For development, **disable “Confirm email”** so signup/login return a session immediately.
- Set **Site URL** to `http://localhost:3000`.

## 4. Server environment

Copy `server/.env.example` to `server/.env` and fill in:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLIENT_URL=http://localhost:3000
JWT_COOKIE_EXPIRES_IN=90
CLOUD_NAME=...
API_KEY=...
API_SECRET=...
```

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
| 401 on protected routes | Confirm email disabled or user confirmed; check `jwt` cookie |
| Room not found | Ensure both users exist in `profiles` |
| Realtime not firing | Enable Replication for `messages` in Database → Publications |
