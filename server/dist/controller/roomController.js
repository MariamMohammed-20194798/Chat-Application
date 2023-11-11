"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMsg = exports.getRoom = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const RoomModel_1 = __importDefault(require("../models/RoomModel"));
/* export const sendMsg: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    const from = req.params.from;
    const to = req.params.to;
    const { message } = req.body;

    const author = await User.findById(from);
    const friend = await User.findById(to);

    if (!author || !friend)
      return next(new AppError("Author or Friend not found", 404));

    const newMessage: IMessage = {
      from: author._id,
      to: friend._id,
      text: message,
      createdAt: new Date(),
    };

    let room = await Room.findOne({
      participants: { $all: [from, to] },
    });

    if (!room) {
      room = new Room({
        participants: [from, to],
        messages: [newMessage],
      });
    } else {
      room.messages.push(newMessage);
    }

    await room.save();
    await author.save();
    await friend.save();

    return res.status(200).json({
      message: newMessage,
    });
  } catch (err) {
    return next(new AppError("Internal server error", 500));
  }
}); */
exports.getRoom = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a, _b, _c, _d;
    let room = await RoomModel_1.default.findOne({
        participants: { $all: [(_a = req.user) === null || _a === void 0 ? void 0 : _a.id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.id] },
    });
    let statusCode = 200;
    if (!room) {
        room = await RoomModel_1.default.create({
            participants: [(_c = req.user) === null || _c === void 0 ? void 0 : _c.id, (_d = req.params) === null || _d === void 0 ? void 0 : _d.id],
        });
        statusCode = 201;
    }
    res.status(statusCode).json({
        room,
    });
});
/* export const sendMessage: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const { message } = req.body;
    const roomId = req.params?.id;

    const newMessage: IMessage = {
      from: req.user?.id,
      to: req.body.participants[1],
      text: message,
      createdAt: new Date(),
    };

    res.status(200).json({
      room,
    });
  }
); */
/* export const getRoom: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    const { from, to } = req.params;

    const room = await Room.findOne({
      participants: { $all: [from, to] },
    });

    if (!room) {
      return next(new AppError("Room not found", 404));
    }

    return res.status(200).json({
      room,
    });
  } catch (err) {
    return next(new AppError("Internal server error", 500));
  }
}); */
exports.getLastMsg = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
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
