import styled from "styled-components";

export const Div = styled.div`
  background-color: #192734;
  margin-top: -1.4rem;
  margin-left: -1.4rem;
  margin-right: -1.4rem;
  align-items: center;
  display: flex;
`;

export const P = styled.p`
  color: white;
  font-size: 1.5rem;
`;
export const P2 = styled.p`
  color: #97a4af;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: "";
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
  margin-top: 0.6rem;
  margin-right: 1rem;
  margin-left: 1rem;
`;

export const Border = styled.div`
  border-bottom: 1px solid rgba(204, 204, 204, 0.2);
`;

export const DivIcon = styled.div`
  color: white;
  position: relative;
  top: 3px;
  font-size: 2rem;
  &:hover {
    color: #1da1f2;
  }
`;
export const DivIconSearch = styled.div`
  color: white;
  position: relative;
  margin-right: 3rem;
  top: 3px;
  font-size: 2rem;
  &:hover {
    color: #1da1f2;
  }
`;
