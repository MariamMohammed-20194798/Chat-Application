// FriendsList.tsx
import React, { useState, useEffect } from "react";
import { DivFollow, Container, Li } from "./friendsListStyled";
import FriendItem from "../FriendItem/FriendItem";
import def from "./../../imgs/default.jpg";
import instance from "../../axios";

interface FriendsProp {
  _id: string;
  name: string;
  msg: string;
  username: string;
  userImage: string;
  messages: any;
}

type FriendsListProps = {
  searchQuery: string;
};

const FriendsList: React.FC<FriendsListProps> = ({ searchQuery }) => {
  const [friends, setFriends] = useState<FriendsProp[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("users/getAllUsers");
        if (res.data.status === "success") {
          setFriends(res.data.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DivFollow>
      <Container>
        <ul>
          {filteredFriends.map((friend) => (
            <Li key={friend._id}>
              <FriendItem
                _id={friend._id}
                name={friend.username}
                userImage={def}
                user={friend}
                msg="Hello"
              />
            </Li>
          ))}
        </ul>
      </Container>
    </DivFollow>
  );
};

export default FriendsList;
