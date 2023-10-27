import React, { useEffect, useState, useRef } from "react";
import { useAuthorDataStore } from "../../Storage/authorStorage";
import { useDataStore } from "../../Storage/userStorage";
import { Spinner } from "../Spinner/spinner";
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
  DivSpinner,
} from "./chatStyled";
import RightHeader from "../RightHeader/RightHeader";
import { useLastMsgStore } from "../../Storage/lastMsgStore";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8000");

interface Message {
  id: number;
  text: string;
  to: string;
  createdAt: string;
}

interface Conversation {
  messages: Message[];
}

const ConversationComponent: React.FC = () => {
  const { receiverId } = useParams();

  const authorId = useAuthorDataStore((state: any) => state.authorData);
  const friendId = useDataStore((state: any) => state.data);
  const setLastMsg = useLastMsgStore((state: any) => state.setLastMsg);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversation();
  }, [authorId?._id, friendId?._id]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      setConversation(null);
      const response = await instance.get(
        `/room/${authorId?._id}/${friendId?._id}`
      );

      setConversation(response.data.room);
      const lastMessage =
        response.data.conversation.messages.slice(-1)[0].message;
      setLastMsg({ text: lastMessage, id: friendId?._id });
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  const sendMessage = async () => {
    try {
      const res = await instance.post(
        `room/${authorId?._id}/${friendId?._id}/send-message`,
        { message: newMessage }
      );
      socket.emit("send_message", res.data.message);
      setLastMsg({ text: newMessage, id: receiverId });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setLastMsg({ text: data.text, id: data.from });
      setConversation((prevConversation) => {
        if (prevConversation) {
          return {
            ...prevConversation,
            messages: [...prevConversation.messages, data],
          };
        }
        return null;
      });
    });
  }, [socket]);

  const convertToTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString();
  };

  return (
    <>
      <RightHeader />
      <ConversationContainer ref={chatContainerRef}>
        <div>
          {conversation?.messages.map((message) => (
            <React.Fragment key={message.id}>
              {message.to === friendId?._id ? (
                <Container2>
                  <Img2 src={authorId?.photo} alt="Avatar" />
                  <P>{message.text}</P>
                  <TimeLeft>{convertToTime(message.createdAt)}</TimeLeft>
                </Container2>
              ) : (
                <Container>
                  <Img src={friendId?.photo} alt="Avatar" />
                  <P>{message.text}</P>
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
        {isLoading ? (
          <DivSpinner>
            <Spinner />
          </DivSpinner>
        ) : null}
      </ConversationContainer>
    </>
  );
};

export default ConversationComponent;
