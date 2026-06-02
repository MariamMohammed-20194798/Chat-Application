import { IProfile, IMessage, IUserResponse } from "../types/database";

/** Map Supabase profile to MongoDB-compatible API shape */
export const profileToApiUser = (profile: IProfile): IUserResponse => ({
  _id: profile.id,
  username: profile.username,
  email: profile.email,
  photo: profile.photo,
  createdAt: profile.created_at,
});

export const profileToApiUsers = (profiles: IProfile[]): IUserResponse[] =>
  profiles.map(profileToApiUser);

/** Map DB message row to client message shape */
export const messageToApi = (row: {
  id?: string;
  text: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
}): IMessage => ({
  id: row.id,
  text: row.text,
  from: row.from_user_id,
  to: row.to_user_id,
  createdAt: row.created_at,
});

/** Map room + messages to MongoDB-compatible room response */
export const roomToApi = (
  roomId: string,
  participants: string[],
  messages: IMessage[],
  timestamps?: { created_at?: string; updated_at?: string }
) => ({
  _id: roomId,
  participants,
  messages,
  createdAt: timestamps?.created_at,
  updatedAt: timestamps?.updated_at,
});
