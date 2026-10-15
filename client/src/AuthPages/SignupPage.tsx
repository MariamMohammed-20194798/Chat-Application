import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiShield,
  FiUser,
} from "react-icons/fi";
import io from "socket.io-client";
import instance from "../axios";
import { useAuthorDataStore } from "../Storage/authorStorage";
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
  PasswordHint,
  PasswordToggle,
  SecurityNote,
  SuccessNotice,
  Text,
} from "./authPagesStyled";

const socket = io("http://localhost:8000");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const setAuthor = useAuthorDataStore((state: any) => state.setAuthorData);

  const joinRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !trimmedEmail || !password) {
      setErrorMsg("Please fill in your name, email address, and password.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMsg("Enter a valid email address to continue.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Your password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post("users/signup", {
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });

      if (res.data.requiresEmailConfirmation) {
        setSuccessMsg(
          res.data.message ||
            "Your account is ready. Please check your inbox to confirm your email before signing in.",
        );
      } else if (res.data.status === "success") {
        const user = res.data.data.user;
        socket.emit("userOnline", user);
        socket.emit("userSignedUp", user);
        setAuthor(user);
        nav("/", { replace: true });
      } else {
        setErrorMsg("We couldn’t create your account. Please try again.");
      }
    } catch (err: any) {
      if (err.response) {
        const responseMessage = err.response.data?.message;
        if (err.response.status === 400) {
          setErrorMsg(
            responseMessage ||
              "Check your details and make sure your password has at least 8 characters.",
          );
        } else if (err.response.status === 429 || err.response.status === 502) {
          setErrorMsg(
            responseMessage ||
              "We couldn’t send the confirmation email right now. Please try again later.",
          );
        } else if (err.response.status === 503) {
          setErrorMsg("Cannot reach Supabase right now. Please try again later.");
        } else if (err.response.status === 409) {
          setErrorMsg(
            responseMessage || "This email is already registered. Please sign in.",
          );
        } else {
          setErrorMsg(
            responseMessage || "Something went wrong. Please try again later.",
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
      <Eyebrow>Your people are one hello away</Eyebrow>
      <PageTitle>Create your account</PageTitle>
      <PageDescription>
        Make a little space for better conversations.
      </PageDescription>

      <AuthForm onSubmit={joinRoom} noValidate>
        <FieldGroup>
          <FieldLabel htmlFor="signup-username">Your name</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true"><FiUser size={17} /></InputIcon>
            <InputText
              autoComplete="username"
              autoFocus
              id="signup-username"
              name="username"
              type="text"
              placeholder="How should we call you?"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? "signup-error" : undefined}
            />
          </InputShell>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true"><FiMail size={17} /></InputIcon>
            <InputText
              autoComplete="email"
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? "signup-error" : undefined}
            />
          </InputShell>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="signup-password">Password</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true"><FiLock size={17} /></InputIcon>
            <InputText
              autoComplete="new-password"
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={
                errorMsg ? "signup-error signup-password-hint" : "signup-password-hint"
              }
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
          <PasswordHint id="signup-password-hint">
            Use at least 8 characters.
          </PasswordHint>
        </FieldGroup>

        {errorMsg && (
          <P id="signup-error" role="alert">
            {errorMsg}
          </P>
        )}
        {successMsg && (
          <SuccessNotice role="status" aria-live="polite">
            <FiCheckCircle size={17} aria-hidden="true" />
            <span>{successMsg}</span>
          </SuccessNotice>
        )}
        <Btn type="submit" disabled={isLoading}>
          {isLoading ? "Creating your account…" : "Create account"}
          {!isLoading && <FiArrowRight size={17} aria-hidden="true" />}
        </Btn>
      </AuthForm>

      <Text>
        Already have an account? <LinkDiv to="/login">Sign in</LinkDiv>
      </Text>
      <SecurityNote>
        <FiShield size={13} aria-hidden="true" /> Your details stay private and
        secure
      </SecurityNote>
    </AuthLayout>
  );
};

export default SignupPage;
