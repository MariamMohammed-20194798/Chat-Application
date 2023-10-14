import React, { useEffect, useState } from "react";
import { useAuthorDataStore } from "../../Storage/authorStorage";
import { useDataStore } from "../../Storage/userStorage";
import { useLastmsgStore } from "../../Storage/lastMsgStore";
import defaultImg from "./../../imgs/default.jpg";
import instance from "../../axios";
import io from "socket.io-client";
import {
  Container,
  Container2,
  P,
  Img,
  Img2,
  TimeRight,
  TimeLeft,
  Div,
  Input,
  Btn,
  AiOutlineSendIcon,
  ConversationContainer,
} from "./chatStyled";

const socket = io("http://localhost:8000");
interface Message {
  id: number;
  authorId: string;
  friendId: string;
  message: string;
  friend: string;
  createdAt: string;
}

interface Conversation {
  messages: Message[];
}

const ConversationComponent: React.FC = () => {
  const authorId = useAuthorDataStore((state: any) => state.authorData);
  const friendId = useDataStore((state: any) => state.data);
  const lastMsg = useLastmsgStore((state: any) => state.setLastMsg);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    fetchConversation();
  }, [authorId._id, friendId._id]);

  const fetchConversation = async () => {
    try {
      setConversation(null);
      const response = await instance.get(
        `/conversations/${authorId._id}/${friendId._id}`
      );

      setConversation(response.data.conversation);
      const msg = response.data.conversation.messages.slice(-1).message;
      lastMsg(msg);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const sendMessage = async () => {
    try {
      await instance.post(`msgs/${authorId._id}/${friendId._id}/send-message`, {
        message: newMessage,
      });
      socket.emit("send_message", newMessage);
      setNewMessage("");
      fetchConversation();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const convertToTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString();
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      fetchConversation();
      console.log(data);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <ConversationContainer>
      <div>
        {conversation?.messages.map((message) => (
          <React.Fragment key={message.id}>
            {message.friend === friendId._id ? (
              <Container2>
                <Img2 src={defaultImg} alt="Avatar" />
                <P>{message.message}</P>
                <TimeLeft>{convertToTime(message.createdAt)}</TimeLeft>
              </Container2>
            ) : (
              <Container>
                <Img src={defaultImg} alt="Avatar" />
                <P>{message.message}</P>
                <TimeRight>{convertToTime(message.createdAt)}</TimeRight>
              </Container>
            )}
          </React.Fragment>
        ))}
      </div>
      <Div>
        <Input
          type="text"
          id="msg"
          value={newMessage}
          placeholder="Message"
          onChange={(e) => {
            e.preventDefault();
            setNewMessage(e.target.value);
          }}
        />
        <Btn onClick={sendMessage}>
          <AiOutlineSendIcon />
        </Btn>
      </Div>
    </ConversationContainer>
  );
};

export default ConversationComponent;
