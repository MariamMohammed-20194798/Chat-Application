import styled from "styled-components";
import Box from "@mui/material/Box";

export const Div2 = styled.div`
  grid-template-columns: 80% 20%;
  @media (min-width: 1281px) {
    grid-template-columns: 85% 15%;
  }
`;
export const Form = styled.div`
  margin-left: 0.5rem;
  margin-top: -2.5rem;
`;
export const DivIcon = styled.div`
  position: relative;
  top: 3.3rem;
  left: 1rem;
  color: #fff;
  font-size: 2rem;
`;

export const Input = styled.input`
  width: 55%;
  background-color: #192734;
  padding: 1rem;
  border: none;
  border-radius: 1rem;
  outline: none;
  color: #fff;
  font-size: 1.3rem;
  padding-left: 4.3rem;
  &:focus {
    border: 1px solid rgb(0, 128, 128);
  }
  @media (min-width: 1281px) {
    width: 62%;
  }
`;
export const Border = styled.div`
  border-bottom: 1px solid #1da1f2;
`;

export const BoxDiv = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  border-radius: 1.5rem;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
`;
export const DivPhoto = styled.div`
  margin-left: 21rem;
  margin-top: -3.4rem;
`;

export const Img = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  position: relative;
  outline: none;
  border: 0.3rem solid rgb(0, 128, 128);
  @media (min-width: 1281px) {
    width: 3rem;
    height: 3rem;
    margin-left: 4.5rem;
    margin-top: rem;
  }
`;
export const Lable = styled.label`
  position: relative;
  display: block;
  width: 10%;
  height: 10%;
  z-index: 50;
`;

export const CameraIcon = styled.i`
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 5;
  font-size: 1.7rem;
  color: #fff;
  top: 3rem;
  left: 3rem;
`;
