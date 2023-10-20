import React from "react";

import { IoIosSearch } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import defaultImg from "./../../imgs/default.jpg";
import {
  Div,
  P,
  P2,
  DivIcon,
  DivIconSearch,
  Border,
  DivImg,
} from "./RightHeaderStyled";
import { useDataStore } from "../../Storage/userStorage";

const RightHeader: React.FC = () => {
  const data = useDataStore((state: any) => state.data);
  return (
    <Div>
      <div>
        <DivImg alt="user" src={defaultImg} />
      </div>
      <div style={{ width: "100%" }}>
        <P>{data.username}</P>
        <P2>online</P2>
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
