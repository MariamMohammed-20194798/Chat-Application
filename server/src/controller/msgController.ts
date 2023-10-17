import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/userModel";
import Msg from "../models/messageModel";
import Conversation from "../models/conversationModel";
import { AppError } from "../utils/appError";

export const sendMsgToFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.params.authorId;
      const friendId = req.params.friendId;
      const { message } = req.body;

      const author = await User.findById(authorId);
      const friend = await User.findById(friendId);

      if (!author || !friend)
        return next(new AppError("Author or Friend not found", 404));

      const newMessage = new Msg({
        author: authorId,
        friend: friendId,
        message: message,
      });

      await newMessage.save();

      // Find or create the conversation between the author and friend
      let conversation = await Conversation.findOne({
        participants: { $all: [authorId, friendId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [authorId, friendId],
          messages: [newMessage._id],
        });
      } else {
        conversation.messages.push(newMessage._id);
      }

      await conversation.save();

      // Add the message to the author's and friend's message history
      author.messages.push(newMessage._id);
      friend.messages.push(newMessage._id);

      await author.save();
      await friend.save();

      return res.status(200).json({
        message: newMessage,
      });
    } catch (err) {
      return next(new AppError("Internal server error", 500));
    }
  }
);

// Function to get a conversation between author and friend
export const getConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorId, friendId } = req.params;

      const conversation = await Conversation.findOne({
        participants: { $all: [authorId, friendId] },
      });

      if (!conversation) {
        return next(new AppError("Conversation not found", 404));
      }

      const messages = await Msg.find({
        _id: { $in: conversation.messages },
      });

      return res.status(200).json({
        conversation: {
          participants: conversation.participants,
          messages,
        },
      });
    } catch (err) {
      return next(new AppError("Internal server error", 500));
    }
  }
);

export const getConvById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const conv = await Conversation.findById(id);

    const message = conv?.messages.slice(-1);

    console.log(message);
    if (!message) {
      throw new Error(`No Conversation with ID ${id} found`);
    }
    return res.status(200).json({
      message,
    });
  }
);
export const getMessageById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const message = await Msg.findById(id);

    if (!message) {
      throw new Error(`No message with ID ${id} found`);
    }
    return res.status(200).json({
      message,
    });
  }
);
