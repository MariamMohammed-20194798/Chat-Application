# MongoDB → Supabase Migration Changelog

## Summary

The backend no longer uses MongoDB/Mongoose. Data lives in Supabase PostgreSQL; authentication uses Supabase Auth with the access token stored in the existing `jwt` httpOnly cookie. The React client is unchanged (still uses `_id` and Socket.IO).

## New files

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | Tables, triggers, `find_or_create_room` RPC |
| `supabase/migrations/002_rls_policies.sql` | Row Level Security policies |
| `server/src/lib/supabase.ts` | Supabase admin + auth clients |
| `server/src/types/database.ts` | TypeScript types |
| `server/src/utils/mongoCompat.ts` | Maps `id` → `_id` for API compatibility |
| `server/src/services/userService.ts` | Profile & presence queries |
| `server/src/services/roomService.ts` | Rooms & messages queries |
| `scripts/migrate-mongo-to-supabase.ts` | One-time MongoDB data migration |
| `server/.env.example` | Environment template |
| `client/.env.example` | Optional Realtime env |
| `client/src/lib/supabase.ts` | Optional browser Supabase client |
| `SUPABASE_SETUP.md` | Setup instructions |
| `MIGRATION_CHANGELOG.md` | This file |

## Removed files

| File | Reason |
|------|--------|
| `server/src/models/userModel.ts` | Replaced by `profiles` table + Supabase Auth |
| `server/src/models/RoomModel.ts` | Replaced by `rooms`, `messages`, `room_participants` |

## Modified files

| File | Changes |
|------|---------|
| `server/package.json` | `mongoose` → `@supabase/supabase-js`; added `build` script |
| `server/src/index.ts` | Removed `mongoose.connect`; Socket uses `insertMessage` |
| `server/src/app.ts` | Error handler after routes; `CLIENT_URL` CORS |
| `server/src/controller/authController.ts` | Supabase Auth signup/login/protect/logout |
| `server/src/controller/userController.ts` | Supabase profile CRUD |
| `server/src/controller/roomController.ts` | Supabase room/message queries |
| `server/src/controller/customRequest.ts` | `IUserResponse` instead of Mongoose `IUser` |
| `server/src/controller/errorController.ts` | Postgres/Supabase error codes |
| `client/package.json` | Added `@supabase/supabase-js` (optional Realtime) |

## Database schema

- **profiles** — `id` (FK `auth.users`), `username`, `email`, `photo`, timestamps
- **rooms** — conversation container
- **room_participants** — M:N users ↔ rooms
- **messages** — normalized messages (was embedded in MongoDB `Room`)
- **user_presence** — optional online state persistence

## Environment variables

**Removed (runtime):** `DATABASE`, `DATABASE_PASSWORD`, `DATABASE_LOCAL`, `JWT_SECRET`, `JWT_EXPIRES_IN`

**Added:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`

**Kept:** `PORT`, `NODE_ENV`, `JWT_COOKIE_EXPIRES_IN`, Cloudinary vars

## API endpoints (unchanged)

- `POST /api/v1/users/signup`
- `POST /api/v1/users/login`
- `GET /api/v1/users/getAllUsers`
- `GET /api/v1/users/getMe`
- `POST /api/v1/users/logout`
- `PATCH /api/v1/users/updateMe`
- `GET /api/v1/room/getRoom/:id`
- `GET /api/v1/room/allRooms`

## Next steps for you

1. Run SQL migrations in Supabase.
2. Update `server/.env` with Supabase keys (remove MongoDB vars).
3. `cd server && npm install && npm run build`.
4. Optionally run `scripts/migrate-mongo-to-supabase.ts` for existing data.
