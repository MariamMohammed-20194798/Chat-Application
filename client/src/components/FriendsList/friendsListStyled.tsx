import styled from "styled-components";

export const DivFollow = styled.div`
  width: 26.5rem;
  @media (min-width: 1281px) {
    width: 31.7rem;
  }
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
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

export const Li = styled.li`
  list-style: none;
  margin-right: 1rem;
`;
