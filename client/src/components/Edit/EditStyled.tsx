import styled from "styled-components";

export const DivBlock = styled.div`
  z-index: 300;
  width: 40rem;
  margin-top: 6rem;
  padding: 1rem;
  border-radius: 1rem;
  justify-content: space-between;
`;

export const DivPhoto = styled.div`
  position: absolute;
  outline: none;
  display: flex;
  transform: translate(-10%, -43%);
`;

export const Img = styled.img`
  width: 10rem;
  height: 10rem;
  outline: none;
  border-radius: 50%;
  position: relative;
  border: 0.4rem solid rgb(0, 128, 128);
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
  z-index: 5;
  font-size: 2rem;
  color: #fff;
  top: -0.3rem;
  left: 3.3rem;
`;

export const Div = styled.div`
  margin-top: -0.5rem;
  margin-left: 10rem;
`;

export const Button = styled.button`
  font-size: 1rem;
  font-weight: 700;
  border-radius: 3rem;
  padding: 0.9rem 2rem;
  transition: all 0.4s;

  background-color: rgb(0, 128, 128);
  border: none;
  transition: transform 0.3s;
  &:hover {
    transform: scale(0.9);
  }
`;

export const DivInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13rem;
  margin-top: -4rem;
`;
export const Input = styled.input`
  width: 80%;
  background-color: #eef2f4;
  border: none;
  margin-bottom: 1.7rem;
  padding: 1.2rem;
  outline: none;
  font-size: 1.2rem;
  color: #14171a;
  border-bottom: 1px solid rgb(0, 128, 128);
`;
