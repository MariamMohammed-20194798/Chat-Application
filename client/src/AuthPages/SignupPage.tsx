import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiChatSmile3Fill } from "react-icons/ri";

import {
  Container,
  Strong,
  LinkDiv,
  InputText,
  Text,
  Btn,
  Div,
  P,
} from "./authPagesStyled";
import instance from "../axios";
import { useAuthorDataStore } from "../Storage/authorStorage";
import io from "socket.io-client";

const socket = io("http://localhost:8000");
const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();
  const setAuthor = useAuthorDataStore((state: any) => state.setAuthorData);

  const joinRoom = async (event: any) => {
    try {
      if (!email || !password) console.log("Email and Password Are Required.");
      const res = await instance.post("users/signup", {
        username,
        email,
        password,
      });
      if (res.data.status === "success") {
        const user = res.data.data.user;
        socket.emit("userOnline", user);
        socket.emit("userSignedUp", user);
        setAuthor(user);
        nav("/", { replace: true });
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setErrorMsg("Username, Email and Password Are Required.");
        } else if (err.response.status === 500) {
          setErrorMsg("Duplicate Email. Please use another value!");
        }
      } else {
        setErrorMsg("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <Div>
        <Strong>Chatty </Strong>
        <RiChatSmile3Fill size={35} color="rgb(0, 128, 128)" />
      </Div>

      <InputText
        type="text"
        id="username"
        placeholder="Username."
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <InputText
        type="text"
        id="email"
        placeholder="Email."
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <InputText
        type="password"
        id="password"
        placeholder="Password."
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      {errorMsg && <P>{errorMsg}</P>}
      <Btn onClick={joinRoom}>CREATE</Btn>
      <Text>
        Already Have An Account? <LinkDiv to="/">Signin</LinkDiv>
      </Text>
    </Container>
  );
};

export default SignupPage;
