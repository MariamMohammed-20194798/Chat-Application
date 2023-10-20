import styled from "styled-components";

export const Form = styled.div`
  width: 80%;
`;
export const DivSearch = styled.div`
  display: flex;
  position: relative;
  left: -30px;
  align-items: center;
`;
export const DivIcon = styled.div`
  position: relative;
  left: 3.3rem;
  top: -4px;
  color: rgb(224, 204, 204);
  font-size: 2rem;
`;

export const Input = styled.input`
  width: 100%;
  background-color: #192734;
  padding: 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 2rem;
  outline: none;
  color: #ffffff;
  font-size: 1.3rem;
  padding-left: 4.3rem;
  &:focus {
    border: 1px solid rgb(0, 128, 128);
  }
  @media (min-width: 1281px) {
    padding-left: 5rem;
  }
`;
export const Border = styled.div`
  border-bottom: 1px solid #1da1f2;
`;
