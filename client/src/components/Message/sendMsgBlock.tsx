import React from "react";
import defaultImg from "./../../imgs/default.jpg";

import { Container2, Img2, P, TimeLeft } from "./messageStyled";

interface Msg {
  message: string;
  createdAt: string;
}
interface sendMsgProp {
  msg: Msg[];
  onConvertTime: Function;
}
const SendMsgBlock: React.FC<sendMsgProp> = ({ msg, onConvertTime }) => {
  console.log(msg);
  return (
    <>
      <Container2>
        <Img2 src={defaultImg} alt="Avatar" />
        {/* <P>{msg.message}</P>
        <TimeLeft>{onConvertTime(msg.createdAt)}</TimeLeft> */}
      </Container2>
    </>
  );
};

export default SendMsgBlock;
