import { RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync";
import { CustomRequest } from "./customRequest";
import Room, { IRoom } from "../models/RoomModel";

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
