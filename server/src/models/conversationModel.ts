import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
interface ConversationSchema extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
  messages: mongoose.Schema.Types.ObjectId[];
}

const conversationSchema = new Schema<ConversationSchema>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model<ConversationSchema>(
  "Conversation",
  conversationSchema
);
export default Conversation;
