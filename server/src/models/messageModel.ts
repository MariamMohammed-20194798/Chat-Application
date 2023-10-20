import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

interface IMessage extends Document {
  author: Schema.Types.ObjectId;
  friend: Schema.Types.ObjectId;
  message: string;
}

const messageSchema = new Schema<IMessage>(
  {
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true }
);

const Msg = mongoose.model<IMessage>("Message", messageSchema);

export default Msg;
