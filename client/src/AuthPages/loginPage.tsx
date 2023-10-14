import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillWechat } from "react-icons/ai";
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
import { useAuthorDataStore } from "../Storage/authorStorage";
import instance from "../axios";

const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const setAuthor = useAuthorDataStore((state: any) => state.setAuthorData);

  const joinRoom = async (event: any) => {
    try {
      event.preventDefault();
      setErrorMsg("");
      if (!email || !password) setErrorMsg("Email and Password Are Required.");
      const res = await instance.post("users/login", {
        email,
        password,
      });

      if (res.data.status === "success") {
        const user = res.data.data.user;
        setAuthor(user);
        nav("/home");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setErrorMsg("Email and Password Are Required.");
        } else if (err.response.status === 401) {
          setErrorMsg("Incorrect email or password.");
        }
      } else {
        setErrorMsg("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <Div>
        <AiFillWechat size={45} color="rgb(30, 155, 270)" />
      </Div>
      <Strong>Join Chat Application</Strong>
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
      <Btn onClick={joinRoom}>LOGIN</Btn>
      <Text>
        Donot Have An Account? <LinkDiv to="/signup">SignUp</LinkDiv>
      </Text>
    </Container>
  );
};

export default LoginPage;
