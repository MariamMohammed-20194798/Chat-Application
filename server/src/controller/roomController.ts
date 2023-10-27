import { RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/UserModel";
import { AppError } from "../utils/appError";
import { IMessage } from "../models/RoomModel";
import { CustomRequest } from "./customRequest";
import Room, { IRoom } from "../models/RoomModel";

export const sendMsg: RequestHandler = catchAsync(async (req, res, next) => {
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
});

export const getRoom: RequestHandler = catchAsync(async (req, res, next) => {
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

export const getAllRooms: RequestHandler = catchAsync(
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
