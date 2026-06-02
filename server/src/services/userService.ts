import { supabaseAdmin } from "../lib/supabase";
import { IProfile } from "../types/database";

export const getProfileById = async (id: string): Promise<IProfile | null> => {
  // Retry mechanism to handle trigger timing
  let retries = 0;
  const maxRetries = 3;
  const delayMs = 500;

  while (retries < maxRetries) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data as IProfile;
    }

    retries++;
    if (retries < maxRetries) {
      console.log(`Profile not found, retry ${retries}/${maxRetries} after ${delayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.error(`Profile lookup failed for user ${id} after ${maxRetries} retries`);
  return null;
};

export const getAllProfilesExcept = async (
  excludeId: string
): Promise<IProfile[]> => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, username, email, photo, created_at")
    .neq("id", excludeId);

  if (error) throw error;
  return (data || []) as IProfile[];
};

export const updateProfile = async (
  id: string,
  updates: Partial<Pick<IProfile, "username" | "photo">>
): Promise<IProfile | null> => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as IProfile;
};

export const upsertPresence = async (
  userId: string,
  isOnline: boolean
): Promise<void> => {
  await supabaseAdmin.from("user_presence").upsert(
    {
      user_id: userId,
      is_online: isOnline,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
};
