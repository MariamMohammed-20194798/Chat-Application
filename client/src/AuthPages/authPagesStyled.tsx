import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  text-align: center;
  align-self: center;
  flex-direction: column;
  background-color: #15202b;
`;

export const Strong = styled.strong`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

export const Text = styled.strong`
  color: white;
  margin-top: 1.5rem;
  font-size: 1.4rem;
  margin-bottom: 17.5rem;
`;
export const Text2 = styled.strong`
  color: white;
  margin-top: 1.5rem;
  font-size: 1.4rem;
  margin-bottom: 12rem;
`;
export const LinkDiv = styled(Link)`
  text-decoration: none;
  color: rgb(30, 155, 270);
  &:hover {
    text-decoration: underline;
  }
`;

export const Btn = styled.button`
  padding: 0.7rem 12rem;
  font-size: 1.5rem;
  border-radius: 5rem;
  margin-top: 1rem;
  text-align: center;
  align-self: center;
  color: white;
  background-color: rgb(30, 155, 270);
  border: none;
  &:hover {
    background-color: #15181c;
  }
`;

export const InputText = styled.input`
  height: 1.3vh;
  padding: 1.5rem;
  padding-right: 13rem;
  font-size: 1.3rem;
  align-self: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.4rem;
  background-color: #646c72;
  color: white;
  &::placeholder {
    color: white;
  }
`;

export const Div = styled.div`
  text-align: center;
  align-self: center;
  margin-top: 18rem;
`;
export const P = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
  align-self: center;
  margin-right: 15rem;
`;
