import React from "react";
//import whatsAppImg from "./../../imgs/HlpKYq.png";
import ConversationComponent from "../Chat/chat";
import { ContainerRight } from "./ContainerStyled";

const Container2: React.FC = () => {
  return (
    <ContainerRight
      style={{
        //backgroundImage: `url(${whatsAppImg})`,
        backgroundSize: "320px",
      }}
    >
      <ConversationComponent />
    </ContainerRight>
  );
};

export default Container2;
