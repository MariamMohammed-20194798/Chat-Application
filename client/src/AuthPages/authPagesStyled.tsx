import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  align-self: center;
  flex-direction: column;
`;

export const Strong = styled.strong`
  color: rgb(203 226 220);
  font-size: 2.2rem;
`;

export const Text = styled.strong`
  color: rgb(203 226 220);
  margin-top: 1.5rem;
  font-size: 1.2rem;
`;

export const LinkDiv = styled(Link)`
  text-decoration: none;
  color: rgb(0, 128, 128);
  &:hover {
    text-decoration: underline;
  }
`;

export const Btn = styled.button`
  padding: 0.7rem 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 7rem;
  margin-top: 1rem;
  text-align: center;
  align-self: center;
  color: white;
  background-color: rgb(0, 128, 128);
  border: none;
  transition: transform 0.3s;
  &:hover {
    transform: scale(0.9);
  }
`;

export const InputText = styled.input`
  height: 1.2vh;
  width: 23rem;
  padding: 1.3rem;
  font-size: 1.2rem;
  align-self: center;
  margin-bottom: 1.5rem;
  border-radius: 0.4rem;
  border: none;
  outline: none;
  background-color: rgb(203 226 220);
  &:focus {
    border: 1px solid rgb(0, 128, 128);
  }
  &::placeholder {
    color: black;
  }
`;

export const Div = styled.span`
  text-align: center;
  align-self: center;
  margin-top: 20rem;
  margin-bottom: 1.5rem;
`;
export const P = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
  align-self: center;
  margin-right: 15rem;
`;

export const DivSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid rgba(204, 204, 204, 0.2);
  min-height: 11vh;
`;
