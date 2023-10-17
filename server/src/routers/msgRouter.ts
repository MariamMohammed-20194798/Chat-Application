import express from "express";
import {
  sendMsgToFriend,
  getConvById,
  getMessageById,
} from "../controller/msgController";

const router = express.Router();

// Define the route to send a message to a friend
router.post("/:authorId/:friendId/send-message", sendMsgToFriend);
router.get("/:id", getConvById);
router.get("/:id/getLastMsg", getMessageById);
export default router;
