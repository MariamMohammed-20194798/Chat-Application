import express from "express";
import { getRoom } from "../controller/roomController";
import { getLastMsg } from "../controller/roomController";
import { protect } from "../controller/authController";
export const router = express.Router();

//router.post("/:from/:to/send-message", protect, sendMsg);

router.get("/getRoom/:id", protect, getRoom);

router.get("/allRooms", protect, getLastMsg);
