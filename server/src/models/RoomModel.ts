import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  text: string;
  from: mongoose.Schema.Types.ObjectId;
  to: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

export interface IRoom extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
  messages: IMessage[];
}

const roomSchema = new Schema<IRoom>(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        text: String,
        from: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        to: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;
