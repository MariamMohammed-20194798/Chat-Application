import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../../Storage/userStorage";
import { useAuthorDataStore } from "../../Storage/authorStorage";
import { useLastMsgStore } from "../../Storage/lastMsgStore";
import { DivImg, Div, OnlineDiv, P2, P3 } from "./FriendItemStyled";
import instance from "../../axios";

type ChildProps = {
  _id: string;
  userImage: string;
  name: string;
  user: any;
  isOnline: boolean;
  moveChatToFront: Function;
};

const FriendItem: React.FC<ChildProps> = ({
  _id,
  name,
  userImage,
  user,
  isOnline,
  moveChatToFront,
}) => {
  const author = useAuthorDataStore((state) => state.authorData);
  const setFriend = useDataStore((state) => state.setData);
  const lastMessageStore = useAuthorDataStore((state) => state.lastMessage);
  const [lastMsg, setLastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("room/allRooms");
        const msgs = res.data.data;
        const message = msgs.find(
          (msg: any) =>
            (msg.from === author._id && msg.to === _id) ||
            (msg.to === author._id && msg.from === _id)
        );
        if (message) {
          setLastMsg(message.text);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (lastMessageStore.id === _id) {
      console.log(lastMessageStore);
      setLastMsg(lastMessageStore.newMessage);
      moveChatToFront(_id);
    }
  }, [lastMessageStore]);

  const handleClick = () => {
    setFriend(user);
  };

  return (
    <div>
      <Div onClick={handleClick}>
        <div>
          <DivImg alt="user" src={userImage} />
        </div>
        {isOnline && <OnlineDiv />}
        <div style={{ width: "100%" }}>
          <P3>{name}</P3>
          {lastMsg ? <P2>{lastMsg}</P2> : <P3>{lastMsg}</P3>}
        </div>
      </Div>
    </div>
  );
};

export default FriendItem;
