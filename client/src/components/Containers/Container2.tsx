import React from "react";
import Room from "../Chat/chat";
import { ContainerRight } from "./ContainerStyled";

const Container2: React.FC = () => {
  return (
    <ContainerRight
      style={{
        //backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "320px",
      }}
    >
      <Room />
    </ContainerRight>
  );
};

export default Container2;
