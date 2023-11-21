import React, { useEffect, useState, useRef } from "react";
import { useAuthorDataStore } from "../../Storage/authorStorage";
import { useDataStore } from "../../Storage/userStorage";
import { Spinner } from "../Spinner/spinner";
import instance from "../../axios";
import io from "socket.io-client";
import {
  P,
  Img,
  Img2,
  TimeRight,
  TimeLeft,
  Btn,
  AiOutlineSendIcon,
  TypeArea,
  Container,
  ConversationContainer,
  DivSpinner,
  ContainerSender,
  ContainerReceiver,
  MessageReceiver,
  MessageSender,
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
    const group1 = date.toLocaleTimeString().slice(0, 4);
    const group2 = date.toLocaleTimeString().slice(7, 11);
    const time = group1 + group2;
    return time;
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
      />{" "}
      <ConversationContainer ref={chatContainerRef}>
        {isLoading ? (
          <DivSpinner>
            <Spinner />
          </DivSpinner>
        ) : (
          <div>
            {conversation?.map((message: Message) => (
              <>
                {message.from === from ? (
                  <ContainerSender>
                    <MessageSender>
                      <Img2 src={authorId?.photo} alt="Avatar" />
                      <P>{message.text}</P>
                      <TimeLeft>{convertToTime(message.createdAt)}</TimeLeft>
                    </MessageSender>
                  </ContainerSender>
                ) : (
                  <ContainerReceiver>
                    <MessageReceiver>
                      <Img src={friend?.photo} alt="Avatar" />
                      <P>{message.text}</P>
                      <TimeRight>{convertToTime(message.createdAt)}</TimeRight>
                    </MessageReceiver>
                  </ContainerReceiver>
                )}
              </>
            ))}
          </div>
        )}
      </ConversationContainer>
      <Container>
        <TypeArea
          placeholder="Message"
          maxRows={3}
          value={newMessage}
          onChange={(e) => {
            e.preventDefault();
            setNewMessage(e.target.value);
          }}
        />

        <Btn onClick={sendMessage}>
          <AiOutlineSendIcon />
        </Btn>
      </Container>
    </>
  );
};

export default Room;
