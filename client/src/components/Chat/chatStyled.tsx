import styled from "styled-components";
import { AiOutlineSend } from "react-icons/ai";

export const ConversationContainer = styled.div`
  height: 50rem; /* Adjust the height as needed */
  overflow-y: scroll;
  margin-right: -1.5rem;
  margin-top: 0.1rem;

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 0.9rem;
    position: fixed;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 0.4rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

export const Container = styled.div`
  position: flex;
  width: 50%;
  background-color: #273746;
  border-radius: 0.6rem;
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
  width: 50%;
  float: right;
  border-color: #ccc;
  background-color: #075e54;
  border-radius: 0.6rem;
  padding: 0.1rem;
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
  margin-top: 1.1rem;
`;

export const Img = styled.img`
  margin-top: 0.8rem;
  margin-right: 1rem;
  margin-left: 0.5rem;
  float: left;
  max-width: 45px;
  border-radius: 50%;
`;
export const Img2 = styled.img`
  float: right;
  max-width: 45px;
  margin-top: 0.8rem;
  margin-right: 0.5rem;
  border-radius: 50%;
`;

export const TimeRight = styled.span`
  float: right;
  margin-top: -1rem;
  margin-right: 1rem;
  color: #aaa;
`;
export const TimeLeft = styled.span`
  float: left;
  margin-top: -1rem;
  margin-left: 0.5rem;
  color: #999;
`;

export const Div = styled.div`
  position: fixed;
  width: 60%;
  margin-top: 50.5rem;
`;
export const Input = styled.input`
  font-size: 1.3rem;
  float: left;
  width: 77%;
  padding: 0.9rem;
  border-radius: 2rem;
  border: none;
  background-color: #273746;
  color: white;
  &:hover {
    border: none;
  }
`;

export const AiOutlineSendIcon = styled(AiOutlineSend)`
  font-size: 1.8rem;
`;

export const Btn = styled.button`
  color: #fff;
  padding: 0.6rem 0.9rem;
  background-color: #075e54;
  border: none;
  border-radius: 3rem;
  margin-left: 0.5rem;
`;

export const DivSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid rgba(204, 204, 204, 0.2);
  min-height: 11vh;
`;
