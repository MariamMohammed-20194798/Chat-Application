import React from "react";
//import whatsAppImg from "./../../imgs/HlpKYq.png";
import Room from "../Chat/chat";
import { ContainerRight } from "./ContainerStyled";
import RightHeader from "../RightHeader/RightHeader";

const Container2: React.FC = () => {
  return (
    <ContainerRight
      style={{
        //backgroundImage: `url(${whatsAppImg})`,
        backgroundSize: "320px",
      }}
    >
      <Room />
    </ContainerRight>
  );
};

export default Container2;
