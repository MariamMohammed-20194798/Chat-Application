import React from "react";
import RightHeader from "../RightHeader/RightHeader";
import whatsappImg from "./../../imgs/HlpKYq.png";
import ConversationComponent from "../Chat/chat";
import { Wrapper, ContainerLeft, ContainerRight } from "./ContainerStyled";
import SearchBar from "../SearchBar/searchBar";

const Container2: React.FC = () => {
  return (
    <Wrapper>
      <ContainerLeft>
        <SearchBar />
      </ContainerLeft>
      <ContainerRight
        style={{
          backgroundImage: `url(${whatsappImg})`,
          backgroundSize: "320px",
        }}
      >
        <RightHeader />
        <ConversationComponent />
      </ContainerRight>
    </Wrapper>
  );
};

export default Container2;
