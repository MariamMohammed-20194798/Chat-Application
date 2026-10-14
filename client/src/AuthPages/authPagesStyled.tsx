import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -14px, 0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const AuthPageShell = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  width: auto;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  place-items: center;
  overflow: hidden;
  padding: 32px;
  color: #201b35;
  background:
    radial-gradient(ellipse at 9% 8%, rgba(113, 0, 255, 0.09), transparent 27%),
    radial-gradient(ellipse at 94% 90%, rgba(112, 181, 255, 0.2), transparent 30%),
    #f1f7ff;

  &::before,
  &::after {
    position: absolute;
    z-index: 0;
    content: "";
    width: 260px;
    height: 260px;
    border-radius: 50%;
    filter: blur(2px);
    pointer-events: none;
    animation: ${float} 9s ease-in-out infinite;
  }

  &::before {
    top: -145px;
    right: 13%;
    background: radial-gradient(circle, rgba(171, 123, 255, 0.15), transparent 70%);
  }

  &::after {
    bottom: -165px;
    left: 8%;
    background: radial-gradient(circle, rgba(92, 174, 255, 0.18), transparent 70%);
    animation-delay: -4s;
  }

  @media (max-width: 700px) {
    padding: 18px;
  }

  @media (min-width: 1281px) {
    width: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }
`;

export const AuthFrame = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  width: min(1160px, 100%);
  min-height: 690px;
  grid-template-columns: 0.95fr 1.05fr;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 30px 90px rgba(41, 61, 104, 0.13), 0 3px 10px rgba(41, 61, 104, 0.04);
  animation: ${riseIn} 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both;

  @media (max-width: 860px) {
    width: min(560px, 100%);
    min-height: 0;
    grid-template-columns: 1fr;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ShowcasePanel = styled.aside`
  position: relative;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  overflow: hidden;
  padding: 42px 44px 34px;
  color: #fff;
  background: linear-gradient(145deg, #6500ed 0%, #7b16ff 50%, #9d43ff 100%);

  &::before,
  &::after {
    position: absolute;
    content: "";
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 50%;
    pointer-events: none;
  }

  &::before {
    top: 22%;
    right: -160px;
    width: 360px;
    height: 360px;
  }

  &::after {
    top: 29%;
    right: -105px;
    width: 250px;
    height: 250px;
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

export const BrandRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 11px;
`;

export const BrandMark = styled.div`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 8px 20px rgba(48, 0, 132, 0.16);
`;

export const BrandName = styled.span`
  font-size: 21px;
  font-weight: 750;
  letter-spacing: -0.7px;
`;

export const ShowcaseCopy = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 62px;
`;

export const ShowcaseEyebrow = styled.p`
  margin: 0 0 14px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 1.9px;
  text-transform: uppercase;
`;

export const ShowcaseHeadline = styled.h1`
  max-width: 390px;
  margin: 0;
  font-size: clamp(34px, 4vw, 46px);
  font-weight: 680;
  letter-spacing: -2.2px;
  line-height: 1.1;
`;

export const ShowcaseDescription = styled.p`
  max-width: 360px;
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 15px;
  line-height: 1.7;
`;

export const ChatPreview = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 370px;
  margin: auto auto 0;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.13);
  box-shadow: 0 18px 42px rgba(45, 0, 123, 0.2);
  backdrop-filter: blur(12px);
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

export const PreviewAvatar = styled.div`
  display: grid;
  width: 39px;
  height: 39px;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: linear-gradient(145deg, #ffd3ba, #e7a8ff);
  color: #7623a7;
  font-size: 13px;
  font-weight: 750;
`;

export const PreviewIdentity = styled.div`
  flex: 1;

  strong {
    display: block;
    font-size: 13px;
    font-weight: 650;
  }

  span {
    display: block;
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 11px;
  }
`;

export const PreviewDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8df0b8;
  box-shadow: 0 0 0 4px rgba(141, 240, 184, 0.14);
`;

export const PreviewMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 17px 0 4px;
`;

export const PreviewBubble = styled.div<{ $outgoing?: boolean }>`
  align-self: ${({ $outgoing }) => ($outgoing ? "flex-end" : "flex-start")};
  max-width: 86%;
  padding: 10px 13px;
  border-radius: ${({ $outgoing }) =>
    $outgoing ? "14px 14px 4px 14px" : "14px 14px 14px 4px"};
  background: ${({ $outgoing }) =>
    $outgoing ? "#fff" : "rgba(255, 255, 255, 0.17)"};
  color: ${({ $outgoing }) => ($outgoing ? "#6421b8" : "#fff")};
  font-size: 12px;
  line-height: 1.45;
`;

export const ShowcaseFootnote = styled.p`
  position: relative;
  z-index: 1;
  margin: 20px 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  letter-spacing: 0.2px;
`;

export const FormPanel = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 66px clamp(36px, 6.2vw, 82px);
  background: rgba(255, 255, 255, 0.93);

  @media (max-width: 860px) {
    padding: 56px clamp(30px, 8vw, 68px);
  }

  @media (max-width: 520px) {
    padding: 42px 25px;
  }
`;

export const FormContent = styled.div`
  width: 100%;
  max-width: 390px;
`;

export const MobileBrand = styled(BrandRow)`
  display: none;
  margin-bottom: 38px;
  color: #7010ed;

  ${BrandMark} {
    border-color: #eadbff;
    background: #f5edff;
    box-shadow: none;
  }

  @media (max-width: 860px) {
    display: flex;
  }
`;

export const Eyebrow = styled.p`
  margin: 0 0 12px;
  color: #7623e8;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 1.8px;
  text-transform: uppercase;
`;

export const PageTitle = styled.h2`
  margin: 0;
  color: #201b35;
  font-size: clamp(31px, 4vw, 38px);
  font-weight: 720;
  letter-spacing: -1.55px;
  line-height: 1.15;
`;

export const PageDescription = styled.p`
  margin: 12px 0 30px;
  color: #77758a;
  font-size: 14px;
  line-height: 1.65;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 19px;

  > * {
    animation: ${riseIn} 420ms ease both;
  }

  > *:nth-child(1) { animation-delay: 60ms; }
  > *:nth-child(2) { animation-delay: 120ms; }
  > *:nth-child(3) { animation-delay: 180ms; }
  > *:nth-child(4) { animation-delay: 240ms; }
  > *:nth-child(5) { animation-delay: 300ms; }

  @media (prefers-reduced-motion: reduce) {
    > * {
      animation: none;
    }
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: #38344d;
  font-size: 12px;
  font-weight: 650;
`;

export const InputShell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 15px;
  display: flex;
  color: #9a96ad;
  pointer-events: none;
`;

export const InputText = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 48px 0 44px;
  border: 1px solid #e7e5ee;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #25213b;
  font: inherit;
  font-size: 13px;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;

  &::placeholder {
    color: #aaa7b6;
  }

  &:hover {
    border-color: #d2c9e5;
  }

  &:focus {
    border-color: #8a36f5;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(126, 37, 237, 0.1);
  }

  &:focus + button {
    color: #7623e8;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9692a8;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease;

  &:hover {
    background: #f5efff;
    color: #7623e8;
  }

  &:focus-visible {
    outline: 2px solid #8a36f5;
    outline-offset: 2px;
  }
`;

export const Btn = styled.button`
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(100deg, #6d05ed 0%, #861fff 55%, #9b37ff 100%);
  box-shadow: 0 9px 20px rgba(116, 18, 237, 0.2);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.35px;
  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 13px 25px rgba(116, 18, 237, 0.28);
    filter: saturate(1.12);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.99);
  }

  &:focus-visible {
    outline: 3px solid rgba(126, 37, 237, 0.28);
    outline-offset: 3px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.76;
  }
`;

export const ButtonSpinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 700ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2s;
  }
`;

export const P = styled.p`
  margin: -4px 0 0;
  padding: 11px 13px;
  border: 1px solid #ffd7dc;
  border-radius: 10px;
  background: #fff5f6;
  color: #b42338;
  font-size: 12px;
  line-height: 1.5;
`;

export const SuccessNotice = styled.div`
  display: flex;
  gap: 10px;
  padding: 13px;
  border: 1px solid #c9eedb;
  border-radius: 11px;
  background: #f1fbf5;
  color: #17643a;
  font-size: 12px;
  line-height: 1.55;

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
  }
`;

export const PasswordHint = styled.p`
  margin: -1px 0 0;
  color: #9692a5;
  font-size: 11px;
`;

export const Text = styled.p`
  margin: 25px 0 0;
  color: #888599;
  text-align: center;
  font-size: 12px;
`;

export const LinkDiv = styled(Link)`
  margin-left: 4px;
  color: #7623e8;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &:focus-visible {
    border-radius: 2px;
    outline: 2px solid #8a36f5;
    outline-offset: 3px;
  }
`;

export const SecurityNote = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin: 31px 0 0;
  color: #aaa7b5;
  font-size: 10px;

  svg {
    color: #8b87a0;
  }
`;
