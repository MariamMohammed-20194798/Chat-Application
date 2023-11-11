import React from "react";
import { IoIosSearch } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import {
  Div,
  P,
  P2,
  DivIcon,
  DivIconSearch,
  DivImg,
} from "./RightHeaderStyled";

import { useAuthorDataStore } from "../../Storage/authorStorage";

export interface HeaderProps {
  username: string;
  photo: string;
  id: string;
}

const RightHeader: React.FC<HeaderProps> = ({ username, photo, id }) => {
  const onlineUsers = useAuthorDataStore((state) => state.onlineUsers);

  const status = onlineUsers.has(id);

  return (
    <Div>
      <div>
        <DivImg alt="user" src={photo} />
      </div>
      <div style={{ width: "100%" }}>
        <P>{username}</P>
        {status ? <P2>Online</P2> : <P2>Offline</P2>}
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
