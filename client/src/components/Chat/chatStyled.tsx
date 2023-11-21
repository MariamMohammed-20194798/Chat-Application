import styled from "styled-components";
import { AiOutlineSend } from "react-icons/ai";
import { TextareaAutosize } from "@mui/material";

export const ConversationContainer = styled.div`
  height: 87%; /* Adjust the height as needed */
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

export const DivMsg = styled.div`
  width: 100%;
`;

export const Div = styled.div`
  position: fixed;
  width: 60%;
  margin-top: 9rem;
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

export const DivSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid rgba(204, 204, 204, 0.2);
  min-height: 11vh;
`;

export const ContainerSender = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const ContainerReceiver = styled(ContainerSender)`
  justify-content: flex-start;
`;

export const MessageBase = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
  max-width: 60%;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  gap: 0.2rem;
`;

export const MessageSender = styled(MessageBase)`
  background-color: #075e54;
  border-bottom-right-radius: 0rem;

  .text {
    color: rgb(0, 0, 0);
  }
`;

export const MessageReceiver = styled(MessageBase)`
  background-color: #273746;
  border-bottom-left-radius: 0rem;
`;

export const Img = styled.img`
  width: 3.3rem;
  height: 3.3rem;
  margin-top: 0.6rem;
  border-radius: 50%;
`;
export const Img2 = styled.img`
  width: 3.3rem;
  height: 3.3rem;
  margin-top: 0.6rem;
  border-radius: 50%;
`;

export const P = styled.p`
  color: white;
  font-size: 1.3rem;
  margin-left: 1rem;
  margin-top: 1.1rem;
  word-break: break-word;
`;

export const TimeRight = styled.span`
  margin-top: auto;
  color: #aaa;
`;
export const TimeLeft = styled.span`
  margin-top: auto;
  color: #999;
`;

export const Container = styled.div`
  position: fixed;
  width: 54%;
  margin-top: 2rem;
  border-radius: 2rem;
  background-color: #273746;
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TypeArea = styled(TextareaAutosize)`
  width: 90%;
  font: 1.1em sans-serif;
  padding: 0.5rem;
  background-color: #273746;
  border: none;
  color: white;
  resize: none;
  outline: none;
  overflow: hidden;
  &:focus {
    outline: none;
    overflow: hidden;
  }

  &::placeholder {
    color: rgb(159, 159, 159);
  }
`;
export const AiOutlineSendIcon = styled(AiOutlineSend)`
  font-size: 1.8rem;
`;

export const Btn = styled.button`
  background-color: #273746;
  color: white;
  border: none;
  border-radius: 3rem;
`;
