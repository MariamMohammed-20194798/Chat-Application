import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";
import io from "socket.io-client";
import { useAuthorDataStore } from "../Storage/authorStorage";
import instance from "../axios";
import AuthLayout from "./AuthLayout";
import {
  AuthForm,
  BrandMark,
  BrandName,
  Btn,
  Eyebrow,
  FieldGroup,
  FieldLabel,
  InputIcon,
  InputShell,
  InputText,
  LinkDiv,
  MobileBrand,
  P,
  PageDescription,
  PageTitle,
  PasswordToggle,
  SecurityNote,
  Text,
} from "./authPagesStyled";

const socket = io("http://localhost:8000");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuthor = useAuthorDataStore((state: any) => state.setAuthorData);

  const joinRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Enter your email and password to continue.");
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setErrorMsg("Enter a valid email address to continue.");
      return;
    }
    setLoading(true);

    try {
      const res = await instance.post("users/login", {
        email: email.trim(),
        password,
      });

      if (res.data.status === "success") {
        const user = res.data.data.user;
        socket.emit("userOnline", user);
        setAuthor(user);
        nav("/", { replace: true });
      } else {
        setErrorMsg("We couldn’t sign you in. Please try again.");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setErrorMsg("Enter your email and password to continue.");
        } else if (err.response.status === 401) {
          setErrorMsg(
            err.response.data?.message || "Incorrect email or password.",
          );
        } else {
          setErrorMsg(
            err.response.data?.message ||
              "Something went wrong. Please try again in a moment.",
          );
        }
      } else {
        setErrorMsg("We couldn’t connect. Check your internet and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <MobileBrand>
        <BrandMark aria-hidden="true">
          <FiMessageCircle size={21} strokeWidth={2.4} />
        </BrandMark>
        <BrandName>chatty</BrandName>
      </MobileBrand>
      <Eyebrow>Welcome back</Eyebrow>
      <PageTitle>Sign in to your space</PageTitle>
      <PageDescription>
        Your conversations are right where you left them.
      </PageDescription>

      <AuthForm onSubmit={joinRoom} noValidate>
        <FieldGroup>
          <FieldLabel htmlFor="login-email">Email address</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true"><FiMail size={17} /></InputIcon>
            <InputText
              autoComplete="email"
              autoFocus
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? "login-error" : undefined}
            />
          </InputShell>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true"><FiLock size={17} /></InputIcon>
            <InputText
              autoComplete="current-password"
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? "login-error" : undefined}
            />
            <PasswordToggle
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </PasswordToggle>
          </InputShell>
        </FieldGroup>

        {errorMsg && (
          <P id="login-error" role="alert">
            {errorMsg}
          </P>
        )}
        <Btn type="submit" disabled={isLoading}>
          {isLoading ? "Signing you in…" : "Sign in"}
          {!isLoading && <FiArrowRight size={17} aria-hidden="true" />}
        </Btn>
      </AuthForm>

      <Text>
        New to Chatty? <LinkDiv to="/signup">Create an account</LinkDiv>
      </Text>
      <SecurityNote>
        <FiShield size={13} aria-hidden="true" /> Your conversations are private
        and secure
      </SecurityNote>
    </AuthLayout>
  );
};

export default LoginPage;
