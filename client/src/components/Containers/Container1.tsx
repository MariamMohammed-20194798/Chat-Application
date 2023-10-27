import React from "react";
import { ContainerRight, H1, Div, Strong } from "./ContainerStyled";
import { RiChatSmile3Fill } from "react-icons/ri";

const Container1: React.FC = (props) => {
  return (
    <ContainerRight>
      <Div>
        <Strong>Chatty </Strong>
        <RiChatSmile3Fill size={38} color="rgb(0, 128, 128)" />
      </Div>
      <H1>Start Chatting With Your Friends.</H1>
    </ContainerRight>
  );
};

export default Container1;
