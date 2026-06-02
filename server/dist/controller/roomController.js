"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMsg = exports.getRoom = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const roomService_1 = require("../services/roomService");
const mongoCompat_1 = require("../utils/mongoCompat");
exports.getRoom = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const otherUserId = req.params.id;
    const currentUserId = req.user._id;
    const { roomId, created } = await (0, roomService_1.findOrCreateRoom)(currentUserId, otherUserId);
    const existing = await (0, roomService_1.getRoomWithMessages)(roomId);
    const statusCode = created ? 201 : 200;
    const room = (0, mongoCompat_1.roomToApi)(roomId, existing.participants, existing.messages, {
        created_at: existing.room.created_at,
        updated_at: existing.room.updated_at,
    });
    res.status(statusCode).json({ room });
});
exports.getLastMsg = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const data = await (0, roomService_1.getLastMessagesAllRooms)();
    res.status(200).json({
        status: "success",
        data,
    });
});
