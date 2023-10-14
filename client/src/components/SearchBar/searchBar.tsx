// SearchBar.tsx
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Form, DivSearch, DivIcon, Input } from "./searchBarStyled";
import FriendsList from "../FriendsList/friendsList";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Form>
      <DivSearch>
        <DivIcon>
          <IoIosSearch />
        </DivIcon>
        <div style={{ width: "100%" }}>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={searchHandler}
          />
        </div>
      </DivSearch>
      <FriendsList searchQuery={searchQuery} />
    </Form>
  );
};
export default SearchBar;
