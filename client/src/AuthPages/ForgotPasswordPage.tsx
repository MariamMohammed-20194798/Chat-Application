import React, { FormEvent, useState } from "react";
import { FiArrowRight, FiCheckCircle, FiMail, FiMessageCircle } from "react-icons/fi";
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
  SuccessNotice,
  Text,
} from "./authPagesStyled";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    const trimmedEmail = email.trim();
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMsg("Enter a valid email address to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post("users/forgotPassword", {
        email: trimmedEmail,
      });
      setSuccessMsg(
        res.data.message ||
          "If that email is registered, a password reset link has been sent.",
      );
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "We couldn’t send a reset email right now. Please try again later.",
      );
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
      <Eyebrow>Account recovery</Eyebrow>
      <PageTitle>Forgot your password?</PageTitle>
      <PageDescription>
        Enter the email on your Chatty account and we’ll send a reset link.
      </PageDescription>

      <AuthForm onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <FieldLabel htmlFor="forgot-email">Email address</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true">
              <FiMail size={17} />
            </InputIcon>
            <InputText
              autoComplete="email"
              autoFocus
              id="forgot-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </InputShell>
        </FieldGroup>

        {errorMsg && (
          <P role="alert">
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
          {isLoading ? "Sending reset link…" : "Send reset link"}
          {!isLoading && <FiArrowRight size={17} aria-hidden="true" />}
        </Btn>
      </AuthForm>

      <Text>
        Remembered it? <LinkDiv to="/login">Sign in</LinkDiv>
      </Text>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
