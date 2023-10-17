import express from "express";
import { getConversation } from "../controller/msgController";

const router = express.Router();
// Define the route to get a conversation
router.get("/conversations/:authorId/:friendId", getConversation);

export default router;
