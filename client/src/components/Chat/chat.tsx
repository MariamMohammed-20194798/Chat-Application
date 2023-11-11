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
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8000");

interface Message {
  text: string;
  from: string;
  createdAt: string;
  to: string;
}
const Room: React.FC = () => {
  const { receiverId } = useParams();

  const authorId = useAuthorDataStore((state: any) => state.authorData);
  const from = useAuthorDataStore((state: any) => state.authorData._id);
  const friend = useDataStore((state: any) => state.data);
  const setLastMessage = useAuthorDataStore(
    (state: any) => state.setLastMessage
  );
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roomHandler = async () => {
      setLoading(true);
      try {
        const res = await instance.get(`/room/getRoom/${receiverId}`);
        const room = res.data.room;

        setRoomId(room._id);
        setConversation(room.messages);

        /*  const [_id] = room.users.filter((el: any) => el._id === receiverId);
        setReceiverName(_id.username);
        setReceiverPhoto(_id.photo); */

        socket.emit("join_room", room._id);
      } catch (error) {
        console.error("Error retrieving room:", error);
      } finally {
        setLoading(false);
      }
    };

    roomHandler();
  }, [receiverId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setLastMessage({ newMessage: data.text, id: data.from });
      setConversation((prev: any) => [
        ...prev,
        { text: data.text, from: data.from, createdAt: data.createdAt },
      ]);
    });
  }, [socket]);

  const sendMessage = () => {
    if (newMessage === "") return;
    const createdAt = new Date();

    socket.emit("send_message", {
      text: newMessage,
      roomId,
      from,
      to: receiverId,
      createdAt,
    });
    console.log(receiverId);
    setLastMessage({ newMessage, id: receiverId });

    setConversation((prev: any) => [
      ...prev,
      { text: newMessage, from, createdAt },
    ]);
    setNewMessage("");
  };

  const convertToTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <>
      <RightHeader
        username={friend.username}
        photo={friend.photo}
        id={receiverId as string}
      />
      <ConversationContainer ref={chatContainerRef}>
        <div>
          {conversation?.map((message: Message) => (
            <>
              {message.from === from ? (
                <Container2>
                  <Img2 src={authorId?.photo} alt="Avatar" />
                  <P>{message.text}</P>
                  <TimeLeft>{convertToTime(message.createdAt)}</TimeLeft>
                </Container2>
              ) : (
                <Container>
                  <Img src={friend?.photo} alt="Avatar" />
                  <P>{message.text}</P>
                  <TimeRight>{convertToTime(message.createdAt)}</TimeRight>
                </Container>
              )}
            </>
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

export default Room;
