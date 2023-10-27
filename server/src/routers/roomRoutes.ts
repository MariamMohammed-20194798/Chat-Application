import express from "express";
import { getRoom } from "../controller/roomController";
import { sendMsg, getAllRooms } from "../controller/roomController";
import { protect } from "../controller/authController";
export const router = express.Router();

router.post("/:from/:to/send-message", protect, sendMsg);

router.get("/:from/:to", getRoom);

router.get("/allRooms", protect, getAllRooms);

/* router.get("/:id", getConvById);
router.get("/:id/getLastMsg", getMessageById); */
