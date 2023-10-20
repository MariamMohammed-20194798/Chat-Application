import styled from "styled-components";

export const Div = styled.div`
  background-color: transparent;
  transition: all 0.4s;
  align-items: center;
  display: flex;
  margin-left: -2rem;
  &:hover {
    background-color: #192734;
  }
`;

export const P = styled.p`
  color: white;
  font-size: 1.7rem;
  margin-bottom: -1rem;
  @media (min-width: 1281px) {
    font-size: 1.2rem;
  }
`;

export const P2 = styled.p`
  color: #97a4af;
  font-size: 1.3rem;
  @media (min-width: 1281px) {
    font-size: 1.1rem;
  }
`;

export const Button = styled.button`
  border: 1px solid #1DA1F2;
  outline: none;
  background: transparent;
  border-radius: 3rem;
  padding: 0.4rem 1.5rem;
  color:#1DA1F2
  cursor: pointer;
  font-weight: 900;

  &:hover {
    background: rgba(29, 161,242, 0.1);
  }
`;

export const DivImg = styled.img`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  margin-top: 0.9rem;
  margin-right: 1.3rem;
  border: 2px solid rgb(0, 128, 128);
  @media (min-width: 1281px) {
    width: 3.3rem;
    height: 3.3rem;
    margin-top: 0.6rem;
  }
`;

export const Border = styled.div`
  border-bottom: 2px solid rgba(204, 204, 204, 0.2);
`;
