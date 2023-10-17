import styled from "styled-components";
import { AiOutlineSend } from "react-icons/ai";

export const ConversationContainer = styled.div`
  height: 50rem; /* Adjust the height as needed */
  overflow-y: scroll;
  margin-right: -1.5rem;
  margin-top: 0.1rem;
`;

export const Container = styled.div`
  position: flex;
  width: 20rem;
  background-color: #273746;
  border-radius: 0.6rem;
  padding: 0.4rem;
  margin: 10px;
  float: left;
  &:after {
    content: "";
    clear: both;
    display: table;
  }
  @media (min-width: 1281px) {
    width: 35rem;
  }
`;

export const Container2 = styled.div`
  position: flex;
  width: 20rem;
  float: right;
  border-color: #ccc;
  background-color: #075e54;
  border-radius: 0.5rem;
  padding: 0.4rem;
  margin: 10px;
  &:after {
    content: "";
    clear: both;
    display: table;
  }
  @media (min-width: 1281px) {
    width: 35rem;
  }
`;
export const P = styled.p`
  color: white;
  font-size: 1.3rem;
  margin-left: 1rem;
  margin-top: 0.9rem;
`;

export const Img = styled.img`
  margin-top: 0.3rem;
  margin-right: 1.5rem;
  margin-left: 0.5rem;
  float: left;
  max-width: 45px;
  border-radius: 50%;
  @media (min-width: 1281px) {
    max-width: 55px;
  }
`;
export const Img2 = styled.img`
  float: right;
  max-width: 45px;
  margin-top: 0.3rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  @media (min-width: 1281px) {
    max-width: 55px;
  }
`;

export const TimeRight = styled.span`
  float: right;
  color: #aaa;
`;
export const TimeLeft = styled.span`
  float: left;
  color: #999;
`;

export const Div = styled.div`
  position: fixed;
  margin-top: 50.5rem;
`;
export const Input = styled.input`
  font-size: 1.3rem;
  float: left;
  width: 30.5rem;
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  background-color: #273746;
  color: white;
  &:hover {
    border: none;
  }
  @media (min-width: 1281px) {
    width: 63rem;
  }
`;

export const AiOutlineSendIcon = styled(AiOutlineSend)`
  font-size: 1.9rem;
`;

export const Btn = styled.button`
  color: #fff;
  background-color: #31c879;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 3rem;
  margin-left: 0.5rem;
  @media (min-width: 1281px) {
    font-size: 1rem;
  }
`;
