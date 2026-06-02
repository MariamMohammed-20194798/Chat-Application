import { supabaseAdmin } from "../lib/supabase";
import { IProfile } from "../types/database";

export const getProfileById = async (id: string): Promise<IProfile | null> => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as IProfile;
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
