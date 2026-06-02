/**
 * One-time migration: MongoDB (Mongoose) → Supabase PostgreSQL
 *
 * Prerequisites:
 *   npm install mongodb @supabase/supabase-js dotenv
 *   Run supabase/migrations/*.sql in your Supabase project first
 *   Disable email confirmation in Supabase Auth (or confirm users manually)
 *
 * Usage:
 *   npx ts-node scripts/migrate-mongo-to-supabase.ts
 *
 * Environment (.env in project root or server/.env):
 *   DATABASE, DATABASE_PASSWORD  — MongoDB Atlas URI
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   MIGRATION_DEFAULT_PASSWORD   — temporary password for migrated users (users must reset)
 */

import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../server/.env") });

const MONGO_URI = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const DEFAULT_PASSWORD =
  process.env.MIGRATION_DEFAULT_PASSWORD || "ChangeMe123!";

interface IdMap {
  [mongoId: string]: string;
}

async function main() {
  if (!MONGO_URI || !process.env.SUPABASE_URL) {
    console.error("Set DATABASE, DATABASE_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db();
  const idMap: IdMap = {};

  console.log("Migrating users...");
  const mongoUsers = await db.collection("users").find({}).toArray();

  for (const u of mongoUsers) {
    const mongoId = u._id.toString();
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        username: u.username,
        photo: u.photo,
      },
    });

    if (error) {
      console.error(`User ${u.email}:`, error.message);
      continue;
    }

    const supabaseId = data.user!.id;
    idMap[mongoId] = supabaseId;

    await supabase
      .from("profiles")
      .update({
        username: u.username,
        photo: u.photo || undefined,
        created_at: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
      })
      .eq("id", supabaseId);

    console.log(`  ${u.email} → ${supabaseId}`);
  }

  console.log("Migrating rooms and messages...");
  const mongoRooms = await db.collection("rooms").find({}).toArray();

  for (const room of mongoRooms) {
    const participantIds = (room.participants || [])
      .map((p: ObjectId) => idMap[p.toString()])
      .filter(Boolean);

    if (participantIds.length < 2) {
      console.warn(`Skipping room ${room._id}: missing participant mapping`);
      continue;
    }

    const { data: newRoom, error: roomError } = await supabase
      .from("rooms")
      .insert({
        created_at: room.createdAt
          ? new Date(room.createdAt).toISOString()
          : new Date().toISOString(),
        updated_at: room.updatedAt
          ? new Date(room.updatedAt).toISOString()
          : new Date().toISOString(),
      })
      .select("id")
      .single();

    if (roomError || !newRoom) {
      console.error(`Room insert failed:`, roomError?.message);
      continue;
    }

    for (const uid of participantIds) {
      await supabase.from("room_participants").insert({
        room_id: newRoom.id,
        user_id: uid,
      });
    }

    const messages = room.messages || [];
    if (messages.length) {
      const rows = messages.map((m: any) => ({
        room_id: newRoom.id,
        text: m.text,
        from_user_id: idMap[m.from?.toString()] || m.from?.toString(),
        to_user_id: idMap[m.to?.toString()] || m.to?.toString(),
        created_at: m.createdAt
          ? new Date(m.createdAt).toISOString()
          : new Date().toISOString(),
      }));

      const { error: msgError } = await supabase.from("messages").insert(rows);
      if (msgError) console.error(`Messages for room ${newRoom.id}:`, msgError.message);
      else console.log(`  Room ${newRoom.id}: ${rows.length} messages`);
    }
  }

  const mapPath = path.join(__dirname, "id-map.json");
  fs.writeFileSync(mapPath, JSON.stringify(idMap, null, 2));
  console.log(`ID map written to ${mapPath}`);
  console.log(
    `\nMigration complete. Users must log in with password: ${DEFAULT_PASSWORD} and change it.`
  );

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
