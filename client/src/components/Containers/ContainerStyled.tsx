import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  height: 97vh;
  grid-template-columns: 40% 60%;
  @media (min-width: 1281px) {
    grid-template-columns: 30% 70%;
    margin-left: 15rem;
    margin-right: 15rem;
    margin-top: 1rem;
  }
`;

export const ContainerLeft = styled.div`
  padding: 15px 0 0 10px;
  background-color: #15202b;
`;

export const ContainerRight = styled.div`
  padding: 20px;
  background-color: #15202b;
  border-left: 0.3rem solid rgba(204, 204, 204, 0.2);
`;

export const Div = styled.div`
  text-align: center;
  align-self: center;
  margin-top: 24rem;
  margin-bottom: -1rem;
`;
export const Strong = styled.strong`
  color: rgb(203 226 220);
  font-size: 3.5rem;
`;
export const H1 = styled.h1`
  color: rgb(203 226 220);
  font-size: 2.6rem;
  text-align: center;
  align-self: center;
`;
