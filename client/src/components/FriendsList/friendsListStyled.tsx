import styled from "styled-components";

export const DivFollow = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export const Container = styled.div`
  height: 54rem;
  overflow-y: scroll;

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 0.8rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 0.4rem;
    margin-left: 3rem;
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
  margin-right: 1.3rem;
`;
