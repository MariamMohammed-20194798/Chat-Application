import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 97vh;
  align-content: center;
  @media (min-width: 1281px) {
    margin-left: 15rem;
    margin-right: 15rem;
    margin-top: 1rem;
  }
`;

export const ContainerLeft = styled.div`
  position: flex;
  width: 40%;
  padding: 20px;
  background-color: #15202b;
  @media (min-width: 1281px) {
    width: 30%;
  }
`;

export const ContainerRight = styled.div`
  position: flex;
  width: 60%;
  padding: 20px;
  background-color: #15202b;
  border-left: 0.3rem solid rgba(204, 204, 204, 0.2);
  @media (min-width: 1281px) {
    width: 70%;
  }
`;

export const H1 = styled.h1`
  color: white;
  font-size: 5rem;
  font-weight: 600;

  text-align: center;
  align-self: center;
`;
export const Div = styled.div`
  text-align: center;
  align-self: center;
  margin-top: 18rem;
`;
