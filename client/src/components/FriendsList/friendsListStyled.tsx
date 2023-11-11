import styled from "styled-components";

export const DivFollow = styled.div`
  width: 100%;
`;

export const Container = styled.div`
  height: 50rem;
  overflow-y: scroll;

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 1.2rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 0.4rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

export const Li = styled.li`
  list-style: none;
`;

export const Ul = styled.ul`
  margin-top: -1rem;
  margin-right: 1rem;
  margin-left: -1rem;
`;

export const LogoutDiv = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.5rem;
  justify-content: center;
  padding-top: 0.5rem;
`;

export const LogoutBtn = styled.div`
  border-radius: 1.5rem;
  text-align: center;
  align-self: center;
  padding: 0.5rem;
  width: 10rem;
  font-weight: bold;
  font-size: 1.3rem;
  color: rgb(0, 128, 128);
  background-color: #192734;
  border: 1px solid rgb(0, 128, 128);
  &:hover {
    color: rgb(0, 128, 128);
    transition: 0.2s;
    transform: scale(1.1);
  }
  transition: ease-out 0.2s;
`;

export const Border = styled.div`
  border-bottom: 2px solid rgba(204, 204, 204, 0.2);
`;
