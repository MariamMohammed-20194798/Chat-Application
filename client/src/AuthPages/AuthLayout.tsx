import React, { ReactNode } from "react";
import { FiCheck, FiMessageCircle } from "react-icons/fi";
import {
  AuthFrame,
  AuthPageShell,
  BrandMark,
  BrandName,
  BrandRow,
  ChatPreview,
  FormPanel,
  FormContent,
  PreviewAvatar,
  PreviewBubble,
  PreviewDot,
  PreviewHeader,
  PreviewIdentity,
  PreviewMessages,
  ShowcaseCopy,
  ShowcaseDescription,
  ShowcaseEyebrow,
  ShowcaseFootnote,
  ShowcaseHeadline,
  ShowcasePanel,
} from "./authPagesStyled";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <AuthPageShell>
    <AuthFrame>
      <ShowcasePanel aria-label="Chatty introduction">
        <BrandRow>
          <BrandMark aria-hidden="true">
            <FiMessageCircle size={21} strokeWidth={2.4} />
          </BrandMark>
          <BrandName>chatty</BrandName>
        </BrandRow>

        <ShowcaseCopy>
          <ShowcaseEyebrow>Good conversations start here</ShowcaseEyebrow>
          <ShowcaseHeadline>Make every hello feel closer.</ShowcaseHeadline>
          <ShowcaseDescription>
            A calmer, more personal space for the people and conversations that
            matter to you.
          </ShowcaseDescription>
        </ShowcaseCopy>

        <ChatPreview aria-label="Example conversation">
          <PreviewHeader>
            <PreviewAvatar aria-hidden="true">A</PreviewAvatar>
            <PreviewIdentity>
              <strong>Alex Morgan</strong>
              <span>Online now</span>
            </PreviewIdentity>
            <PreviewDot aria-label="Online" />
          </PreviewHeader>
          <PreviewMessages>
            <PreviewBubble>Hey! So lovely to hear from you ✨</PreviewBubble>
            <PreviewBubble $outgoing>
              Likewise! How have you been?
            </PreviewBubble>
            <PreviewBubble>Pretty great now that we&apos;re catching up.</PreviewBubble>
          </PreviewMessages>
        </ChatPreview>
        <ShowcaseFootnote>
          <FiCheck size={12} aria-hidden="true" /> A little more human, every day
        </ShowcaseFootnote>
      </ShowcasePanel>
      <FormPanel>
        <FormContent>{children}</FormContent>
      </FormPanel>
    </AuthFrame>
  </AuthPageShell>
);

export default AuthLayout;
