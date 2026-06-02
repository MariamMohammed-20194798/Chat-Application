import { supabaseAdmin } from "../lib/supabase";
import { IMessage } from "../types/database";
import { messageToApi } from "../utils/mongoCompat";

export const findOrCreateRoom = async (
  userId: string,
  otherUserId: string
): Promise<{ roomId: string; created: boolean }> => {
  const { data, error } = await supabaseAdmin.rpc("find_or_create_room", {
    user_a: userId,
    user_b: otherUserId,
  });

  if (error) throw error;

  const result = data as { room_id: string; created: boolean };
  return { roomId: result.room_id, created: result.created };
};

export const getRoomParticipants = async (
  roomId: string
): Promise<string[]> => {
  const { data, error } = await supabaseAdmin
    .from("room_participants")
    .select("user_id")
    .eq("room_id", roomId);

  if (error) throw error;
  return (data || []).map((r) => r.user_id);
};

export const getRoomMessages = async (roomId: string): Promise<IMessage[]> => {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("id, text, from_user_id, to_user_id, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(messageToApi);
};

export const getRoomWithMessages = async (roomId: string) => {
  const { data: room, error: roomError } = await supabaseAdmin
    .from("rooms")
    .select("id, created_at, updated_at")
    .eq("id", roomId)
    .single();

  if (roomError) throw roomError;

  const participants = await getRoomParticipants(roomId);
  const messages = await getRoomMessages(roomId);

  return { room, participants, messages };
};

export const insertMessage = async (payload: {
  roomId: string;
  text: string;
  from: string;
  to: string;
  createdAt?: string;
}): Promise<void> => {
  const { error } = await supabaseAdmin.from("messages").insert({
    room_id: payload.roomId,
    text: payload.text,
    from_user_id: payload.from,
    to_user_id: payload.to,
    created_at: payload.createdAt || new Date().toISOString(),
  });

  if (error) throw error;

  await supabaseAdmin
    .from("rooms")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", payload.roomId);
};

/** Last message per room (for friends list preview) */
export const getLastMessagesAllRooms = async (): Promise<IMessage[]> => {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("text, from_user_id, to_user_id, created_at, room_id")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const seenRooms = new Set<string>();
  const lastPerRoom: IMessage[] = [];

  for (const row of data || []) {
    if (seenRooms.has(row.room_id)) continue;
    seenRooms.add(row.room_id);
    lastPerRoom.push(messageToApi(row));
  }

  return lastPerRoom;
};
