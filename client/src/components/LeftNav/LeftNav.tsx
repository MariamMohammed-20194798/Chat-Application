import { Outlet } from "react-router-dom";
import { Div, Div2 } from "./LeftNavStyled";
import SearchBar from "../SearchBar/searchBar";

export interface LeftNavLayoutProps {}

export const LeftNav: React.FC<LeftNavLayoutProps> = (props) => {
  return (
    <Div>
      <Div2>
        <SearchBar />
      </Div2>
      <Outlet />
    </Div>
  );
};
