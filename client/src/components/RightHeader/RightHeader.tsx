import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import io from "socket.io-client";
import { FiMoreVertical } from "react-icons/fi";
import {
  Div,
  P,
  P2,
  DivIcon,
  DivIconSearch,
  DivImg,
} from "./RightHeaderStyled";
import { useDataStore } from "../../Storage/userStorage";

const socket = io("http://localhost:8000");

interface User {
  _id: string;
  userName: string;
  name: string;
  email: string;
}

const RightHeader: React.FC = () => {
  const data = useDataStore((state: any) => state.data);
  const [onlineUsersArr, setOnlineUsersArr] = useState([]);

  useEffect(() => {
    socket.on("onlineHeader", (onlineUsers) => {
      setOnlineUsersArr(onlineUsers);
    });
  }, [socket]);

  return (
    <Div>
      <div>
        <DivImg alt="user" src={data.photo} />
      </div>
      <div style={{ width: "100%" }}>
        <P>{data.username}</P>
        {onlineUsersArr.some((user: User) => user._id === data._id) ? (
          <P2>Online</P2>
        ) : (
          <P2>Offline</P2>
        )}
      </div>
      <DivIconSearch>
        <IoIosSearch />
      </DivIconSearch>
      <DivIcon>
        <FiMoreVertical />
      </DivIcon>
    </Div>
  );
};
export default RightHeader;
