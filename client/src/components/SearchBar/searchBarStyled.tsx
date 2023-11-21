import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { Box } from "@mui/system";

export const Div2 = styled.div`
  display: flex;
  margin-top: 1rem;
`;

export const Form = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const Input = styled.input`
  background-color: #192734;
  padding: 1.3rem;
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
  left: 4rem;
  color: #fff;
  font-size: 2rem;
`;

export const DivFaEdit = styled(FaEdit)`
  font-size: 3rem;
  color: white;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
`;

export const DivPhoto = styled.div`
  margin-left: 1rem;
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

export const Border = styled.div`
  border-bottom: 1px solid #1da1f2;
`;
