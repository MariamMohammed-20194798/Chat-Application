import { RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync";
import { CustomRequest } from "./customRequest";
import {
  findOrCreateRoom,
  getRoomWithMessages,
  getLastMessagesAllRooms,
} from "../services/roomService";
import { roomToApi } from "../utils/mongoCompat";

export const getRoom: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const otherUserId = req.params.id;
    const currentUserId = req.user!._id;

    const { roomId, created } = await findOrCreateRoom(
      currentUserId,
      otherUserId
    );
    const existing = await getRoomWithMessages(roomId);
    const statusCode = created ? 201 : 200;

    const room = roomToApi(
      roomId,
      existing.participants,
      existing.messages,
      {
        created_at: existing.room.created_at,
        updated_at: existing.room.updated_at,
      }
    );

    res.status(statusCode).json({ room });
  }
);

export const getLastMsg: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const data = await getLastMessagesAllRooms();

    res.status(200).json({
      status: "success",
      data,
    });
  }
);
