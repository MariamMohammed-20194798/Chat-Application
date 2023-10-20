import styled from "styled-components";

export const Div = styled.div`
  display: inline-block;
  position: relative;
  width: 50px;
  height: 50px;
  align-self: center;

  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid rgb(27, 149, 224);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: rgb(0, 128, 128) transparent transparent transparent;

  .ldsRing div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .ldsRing div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .ldsRing div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
