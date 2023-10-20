import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiChatSmile3Fill } from "react-icons/ri";
import { LinearProgress } from "@mui/material";
import {
  Container,
  Strong,
  LinkDiv,
  InputText,
  Text,
  Btn,
  Div,
  P,
  DivSpinner,
} from "./authPagesStyled";
import { useAuthorDataStore } from "../Storage/authorStorage";
import instance from "../axios";
import { Spinner } from "../components/Spinner/spinner";

const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const setAuthor = useAuthorDataStore((state: any) => state.setAuthorData);

  const joinRoom = async (event: any) => {
    try {
      setLoading(false);
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
        setLoading(true);
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
        <Strong>Welcome To Chatty </Strong>
        <RiChatSmile3Fill size={35} color="rgb(0, 128, 128)" />
      </Div>
      {isLoading ? (
        <DivSpinner>
          <Spinner />
        </DivSpinner>
      ) : null}
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
