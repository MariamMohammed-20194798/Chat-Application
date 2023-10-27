"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRooms = exports.getRoom = exports.sendMsg = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const appError_1 = require("../utils/appError");
const RoomModel_1 = __importDefault(require("../models/RoomModel"));
exports.sendMsg = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    try {
        const from = req.params.from;
        const to = req.params.to;
        const { message } = req.body;
        const author = await UserModel_1.default.findById(from);
        const friend = await UserModel_1.default.findById(to);
        if (!author || !friend)
            return next(new appError_1.AppError("Author or Friend not found", 404));
        const newMessage = {
            from: author._id,
            to: friend._id,
            text: message,
            createdAt: new Date(),
        };
        let room = await RoomModel_1.default.findOne({
            participants: { $all: [from, to] },
        });
        if (!room) {
            room = new RoomModel_1.default({
                participants: [from, to],
                messages: [newMessage],
            });
        }
        else {
            room.messages.push(newMessage);
        }
        await room.save();
        await author.save();
        await friend.save();
        return res.status(200).json({
            message: newMessage,
        });
    }
    catch (err) {
        return next(new appError_1.AppError("Internal server error", 500));
    }
});
exports.getRoom = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    try {
        const { from, to } = req.params;
        const room = await RoomModel_1.default.findOne({
            participants: { $all: [from, to] },
        });
        if (!room) {
            return next(new appError_1.AppError("Room not found", 404));
        }
        return res.status(200).json({
            room,
        });
    }
    catch (err) {
        return next(new appError_1.AppError("Internal server error", 500));
    }
});
/* export const getAllRooms: RequestHandler = async (req, res, next) => {
  try {
    const rooms: IRoom[] = await Room.find();
    if (!rooms) {
      return next(new AppError("Rooms not found", 404));
    }
    res.status(200).json({
      status: "success",
      result: rooms.length,
      rooms,
    });
  } catch (error) {
    return next(new AppError("Internal server error", 500));
  }
}; */
/* export const getAllRooms: RequestHandler = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    if (rooms.length === 0) {
      return next(new AppError("Rooms not found", 404));
    }

    const roomsWithLastMessage = await Promise.all(
      rooms.map(async (room) => {
        const lastMessage = room.messages[room.messages.length - 1];
        if (lastMessage) {
          const populatedMessage = await lastMessage;

          return {
            ...room.toObject(),
            lastMessage: populatedMessage,
          };
        }
        return room.toObject();
      })
    );

    res.status(200).json({
      status: "success",
      result: roomsWithLastMessage.length,
      rooms: roomsWithLastMessage,
    });
  } catch (error) {
    return next(new AppError("Internal server error", 500));
  }
}; */
exports.getAllRooms = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const rooms = await RoomModel_1.default.find().select({
        messages: { $slice: -1 },
        users: 0,
        _id: 0,
        __v: 0,
    });
    const data = rooms.flatMap((el) => el.messages);
    res.status(200).json({
        status: "success",
        data,
    });
});
