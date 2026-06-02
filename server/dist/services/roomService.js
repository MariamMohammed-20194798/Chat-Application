"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMessagesAllRooms = exports.insertMessage = exports.getRoomWithMessages = exports.getRoomMessages = exports.getRoomParticipants = exports.findOrCreateRoom = void 0;
const supabase_1 = require("../lib/supabase");
const mongoCompat_1 = require("../utils/mongoCompat");
const findOrCreateRoom = async (userId, otherUserId) => {
    const { data, error } = await supabase_1.supabaseAdmin.rpc("find_or_create_room", {
        user_a: userId,
        user_b: otherUserId,
    });
    if (error)
        throw error;
    const result = data;
    return { roomId: result.room_id, created: result.created };
};
exports.findOrCreateRoom = findOrCreateRoom;
const getRoomParticipants = async (roomId) => {
    const { data, error } = await supabase_1.supabaseAdmin
        .from("room_participants")
        .select("user_id")
        .eq("room_id", roomId);
    if (error)
        throw error;
    return (data || []).map((r) => r.user_id);
};
exports.getRoomParticipants = getRoomParticipants;
const getRoomMessages = async (roomId) => {
    const { data, error } = await supabase_1.supabaseAdmin
        .from("messages")
        .select("id, text, from_user_id, to_user_id, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
    if (error)
        throw error;
    return (data || []).map(mongoCompat_1.messageToApi);
};
exports.getRoomMessages = getRoomMessages;
const getRoomWithMessages = async (roomId) => {
    const { data: room, error: roomError } = await supabase_1.supabaseAdmin
        .from("rooms")
        .select("id, created_at, updated_at")
        .eq("id", roomId)
        .single();
    if (roomError)
        throw roomError;
    const participants = await (0, exports.getRoomParticipants)(roomId);
    const messages = await (0, exports.getRoomMessages)(roomId);
    return { room, participants, messages };
};
exports.getRoomWithMessages = getRoomWithMessages;
const insertMessage = async (payload) => {
    const { error } = await supabase_1.supabaseAdmin.from("messages").insert({
        room_id: payload.roomId,
        text: payload.text,
        from_user_id: payload.from,
        to_user_id: payload.to,
        created_at: payload.createdAt || new Date().toISOString(),
    });
    if (error)
        throw error;
    await supabase_1.supabaseAdmin
        .from("rooms")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", payload.roomId);
};
exports.insertMessage = insertMessage;
/** Last message per room (for friends list preview) */
const getLastMessagesAllRooms = async () => {
    const { data, error } = await supabase_1.supabaseAdmin
        .from("messages")
        .select("text, from_user_id, to_user_id, created_at, room_id")
        .order("created_at", { ascending: false });
    if (error)
        throw error;
    const seenRooms = new Set();
    const lastPerRoom = [];
    for (const row of data || []) {
        if (seenRooms.has(row.room_id))
            continue;
        seenRooms.add(row.room_id);
        lastPerRoom.push((0, mongoCompat_1.messageToApi)(row));
    }
    return lastPerRoom;
};
exports.getLastMessagesAllRooms = getLastMessagesAllRooms;
