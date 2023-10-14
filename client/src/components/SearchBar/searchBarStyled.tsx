import styled from "styled-components";

export const Form = styled.div`
  width: 19rem;
  position: fixed;
  @media (min-width: 1281px) {
    width: 24rem;
  }
`;
export const DivSearch = styled.div`
  display: flex;
  position: relative;
  left: -20px;
  align-items: center;
`;
export const DivIcon = styled.div`
  position: relative;
  left: 2.9rem;
  top: -4px;
  color: rgb(224, 204, 204);
  font-size: 1.7rem;
  @media (min-width: 1281px) {
    left: 3.5rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  background-color: #192734;
  padding: 1.1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 2rem;
  outline: none;
  color: #ffffff;
  font-size: 1.3rem;
  padding-left: 4.3rem;
  &:focus {
    border: 1px solid #1da1f2;
  }
  @media (min-width: 1281px) {
    padding-left: 5rem;
  }
`;
export const Border = styled.div`
  border-bottom: 1px solid #1da1f2;
`;
