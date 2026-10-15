import React, { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMessageCircle,
} from "react-icons/fi";
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
  PasswordHint,
  PasswordToggle,
  Text,
} from "./authPagesStyled";

const readAccessToken = (): string | null => {
  const hash = window.location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(window.location.search);
  return hashParams.get("access_token") || queryParams.get("access_token");
};

const ResetPasswordPage: React.FC = () => {
  const nav = useNavigate();
  const accessToken = useMemo(readAccessToken, []);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(
    accessToken ? "" : "This reset link is missing or expired. Request a new one.",
  );
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    if (!accessToken) {
      setErrorMsg("This reset link is missing or expired. Request a new one.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Your password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await instance.patch(
        "users/resetPassword",
        { password },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      nav("/login", { replace: true });
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "We couldn’t update your password. Request a new reset link.",
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
      <Eyebrow>Choose a new password</Eyebrow>
      <PageTitle>Reset your password</PageTitle>
      <PageDescription>
        Pick a new password for your Chatty account. Use at least 8 characters.
      </PageDescription>

      <AuthForm onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <FieldLabel htmlFor="reset-password">New password</FieldLabel>
          <InputShell>
            <InputIcon aria-hidden="true">
              <FiLock size={17} />
            </InputIcon>
            <InputText
              autoComplete="new-password"
              id="reset-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
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
          <PasswordHint>Use at least 8 characters.</PasswordHint>
        </FieldGroup>

        {errorMsg && (
          <P role="alert">
            {errorMsg}
          </P>
        )}
        <Btn type="submit" disabled={isLoading || !accessToken}>
          {isLoading ? "Updating password…" : "Update password"}
          {!isLoading && <FiArrowRight size={17} aria-hidden="true" />}
        </Btn>
      </AuthForm>

      <Text>
        Back to <LinkDiv to="/login">sign in</LinkDiv>
      </Text>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
