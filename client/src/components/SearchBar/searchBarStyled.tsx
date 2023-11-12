/* import styled from "styled-components";
import Box from "@mui/material/Box";
import { FaEdit } from "react-icons/fa";

export const Div2 = styled.div`
  grid-template-columns: 80% 20%;
`;
export const Form = styled.div`
  margin-left: 1.5rem;
  margin-top: -2rem;
  margin-bottom: 1rem;
`;
export const DivIcon = styled.div`
  position: relative;
  top: 3.5rem;
  left: 1.4rem;
  color: #fff;
  font-size: 2rem;
`;

export const DivFaEdit = styled(FaEdit)`
  display: fixed;
  font-size: 2.6rem;
  color: white;
  margin-left: 1%;
  margin-top: -0.8rem;
  margin-bottom: 2rem;
`;

export const Input = styled.input`
  width: 55%;
  background-color: #192734;
  padding: 1rem;
  border: none;
  border-radius: 3rem;
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
  margin-left: 20rem;
  margin-top: -3.4rem;
`;

export const Img = styled.img`
  width: 3.3rem;
  height: 3.3rem;
  border-radius: 50%;
  position: relative;
  outline: none;
  border: 0.2rem solid rgb(0, 128, 128);
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
`; */

import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { Box } from "@mui/system";

export const DivContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Div2 = styled.div`
  margin-top: -2rem;
  margin-left: -0.8rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-grow: 1;
`;

export const Form = styled.div`
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  background-color: #192734;
  padding: 1rem;
  border: none;
  border-radius: 3rem;
  outline: none;
  color: #fff;
  font-size: 1.3rem;
  padding-left: 4rem;

  &:focus {
    border: 1px solid rgb(0, 128, 128);
  }
  @media (min-width: 1281px) {
    padding-right: 5rem;
  }
`;

export const DivIcon = styled.div`
  position: relative;
  top: 0.2rem;
  left: 3rem;
  color: #fff;
  font-size: 2rem;
`;

export const DivFaEdit = styled(FaEdit)`
  font-size: 2.6rem;
  color: white;
  margin-left: -1.3rem;
  cursor: pointer;
`;

export const DivPhoto = styled.div`
  margin-left: 1rem;
`;

export const Img = styled.img`
  width: 3.3rem;
  height: 3.3rem;
  border-radius: 50%;
  border: 0.2rem solid rgb(0, 128, 128);
  cursor: pointer;

  @media (min-width: 1281px) {
    width: 3rem;
    height: 3rem;
    margin-left: 4.5rem;
  }
`;

export const BoxDiv = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1.5rem;
  background-color: #fff;
  padding: 2rem;
  text-align: center;
`;

export const CameraIcon = styled.i`
  font-size: 1.7rem;
  color: #fff;
`;

export const Lable = styled.label`
  position: relative;
  display: block;
  width: 10%;
  height: 10%;
  z-index: 50;
`;

export const Border = styled.div`
  border-bottom: 1px solid #1da1f2;
`;
