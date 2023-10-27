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
  border-radius: 1.5rem;
  transform: translate(30%, -30%);
  justify-content: center;
  align-items: center;
`;

export const Img = styled.img`
  width: 25rem;
  height: 25rem;
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
  transform: translate(530%, 10%);
  z-index: 5;
  font-size: 3rem;
  color: #fff;
  top: 3rem;
  left: 3rem;
`;

export const Div = styled.div`
  margin-top: 20rem;
  transform: translate(-25%, -40%);
`;

export const Button = styled.button`
  font-size: 1rem;
  font-weight: 700;
  border-radius: 3rem;
  padding: 0.9rem 2rem;
  transition: all 0.4s;
  margin-left: 27.5rem;
  background-color: rgb(0, 128, 128);
  border: none;
  transition: transform 0.3s;
  &:hover {
    transform: scale(0.9);
  }
`;
