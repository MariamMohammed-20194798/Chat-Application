import React from "react";
import {
  Wrapper,
  ContainerLeft,
  ContainerRight,
  H1,
  Div,
} from "./ContainerStyled";
import SearchBar from "../SearchBar/searchBar";
import { AiFillWechat } from "react-icons/ai";

const Container1: React.FC = (props) => {
  return (
    <Wrapper>
      <ContainerLeft>
        <SearchBar />
      </ContainerLeft>
      <ContainerRight>
        <Div>
          <AiFillWechat size={50} color="white" />
        </Div>
        <H1>Start Chatting With Your Friends.</H1>
      </ContainerRight>
    </Wrapper>
  );
};

export default Container1;
