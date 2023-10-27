import styled from "styled-components";

export const Div = styled.div`
  background-color: transparent;
  transition: all 0.4s;
  align-items: center;
  display: flex;
  &:hover {
    background-color: #192734;
  }
`;

export const P = styled.p`
  color: white;
  font-size: 1.4rem;
  margin-bottom: -1rem;
`;

export const P2 = styled.p`
  color: #97a4af;
  font-size: 1.2rem;
  margin-top: -1rem;
`;

export const P3 = styled.p`
  color: white;
  font-size: 1.4rem;
  margin-top: 1.2rem;
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
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  margin-top: 0.9rem;
  margin-right: 1.3rem;
`;

export const Border = styled.div`
  border-bottom: 2px solid rgba(204, 204, 204, 0.2);
`;

export const OnlineDiv = styled.div`
  position: relative;
  width: 18px;
  height: 14px;
  margin-left: -2.5rem;
  margin-right: 1.5rem;
  margin-top: 3.5rem;
  border-radius: 50%;
  background-color: green;
`;
