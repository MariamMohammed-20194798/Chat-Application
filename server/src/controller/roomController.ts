import { RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/UserModel";
import { AppError } from "../utils/appError";
import { IMessage } from "../models/RoomModel";
import { CustomRequest } from "./customRequest";
import Room, { IRoom } from "../models/RoomModel";

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

export const getRoom: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    let room = await Room.findOne({
      participants: { $all: [req.user?.id, req.params?.id] },
    });
    let statusCode: number = 200;

    if (!room) {
      room = await Room.create({
        participants: [req.user?.id, req.params?.id],
      });
      statusCode = 201;
    }

    res.status(statusCode).json({
      room,
    });
  }
);
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

export const getLastMsg: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const rooms = await Room.find().select({
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
  }
);
