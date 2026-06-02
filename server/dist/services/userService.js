"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertPresence = exports.updateProfile = exports.getAllProfilesExcept = exports.getProfileById = void 0;
const supabase_1 = require("../lib/supabase");
const getProfileById = async (id) => {
    const { data, error } = await supabase_1.supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
    if (error || !data)
        return null;
    return data;
};
exports.getProfileById = getProfileById;
const getAllProfilesExcept = async (excludeId) => {
    const { data, error } = await supabase_1.supabaseAdmin
        .from("profiles")
        .select("id, username, email, photo, created_at")
        .neq("id", excludeId);
    if (error)
        throw error;
    return (data || []);
};
exports.getAllProfilesExcept = getAllProfilesExcept;
const updateProfile = async (id, updates) => {
    const { data, error } = await supabase_1.supabaseAdmin
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateProfile = updateProfile;
const upsertPresence = async (userId, isOnline) => {
    await supabase_1.supabaseAdmin.from("user_presence").upsert({
        user_id: userId,
        is_online: isOnline,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
};
exports.upsertPresence = upsertPresence;
