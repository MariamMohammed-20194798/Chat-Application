"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertPresence = exports.updateProfile = exports.getAllProfilesExcept = exports.getProfileById = void 0;
const supabase_1 = require("../lib/supabase");
const getProfileById = async (id) => {
    // Retry mechanism to handle trigger timing
    let retries = 0;
    const maxRetries = 3;
    const delayMs = 500;
    while (retries < maxRetries) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single();
        if (!error && data) {
            return data;
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
