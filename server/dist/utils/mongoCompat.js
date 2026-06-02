"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomToApi = exports.messageToApi = exports.profileToApiUsers = exports.profileToApiUser = void 0;
/** Map Supabase profile to MongoDB-compatible API shape */
const profileToApiUser = (profile) => ({
    _id: profile.id,
    username: profile.username,
    email: profile.email,
    photo: profile.photo,
    createdAt: profile.created_at,
});
exports.profileToApiUser = profileToApiUser;
const profileToApiUsers = (profiles) => profiles.map(exports.profileToApiUser);
exports.profileToApiUsers = profileToApiUsers;
/** Map DB message row to client message shape */
const messageToApi = (row) => ({
    id: row.id,
    text: row.text,
    from: row.from_user_id,
    to: row.to_user_id,
    createdAt: row.created_at,
});
exports.messageToApi = messageToApi;
/** Map room + messages to MongoDB-compatible room response */
const roomToApi = (roomId, participants, messages, timestamps) => ({
    _id: roomId,
    participants,
    messages,
    createdAt: timestamps === null || timestamps === void 0 ? void 0 : timestamps.created_at,
    updatedAt: timestamps === null || timestamps === void 0 ? void 0 : timestamps.updated_at,
});
exports.roomToApi = roomToApi;
