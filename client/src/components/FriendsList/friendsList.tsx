import React, { useState, useEffect } from "react";
import {
  DivFollow,
  Container,
  Li,
  Ul,
  LogoutDiv,
  LogoutBtn,
  Border,
} from "./friendsListStyled";
import { Link } from "react-router-dom";
import FriendItem from "../FriendItem/FriendItem";
import { useAuthorDataStore } from "../../Storage/authorStorage";
import instance from "../../axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  photo: string;
}

type FriendsListProps = {
  searchQuery: string;
};
const socket = io("http://localhost:8000");
const FriendsList: React.FC<FriendsListProps> = ({ searchQuery }) => {
  const nav = useNavigate();
  const [friends, setFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const setAuthor = useAuthorDataStore((state) => state.setAuthorData);
  const author = useAuthorDataStore((state) => state.authorData);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await instance.get("users/getAllUsers");
        setFriends(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("onlineUsers", (data: User[]) => {
      setOnlineUsers(data);
    });
    socket.on("usersSignedUp", (newUsers: User) => {
      setFriends((prev) => [...prev, newUsers]);
    });

    socket.on("offline", (data: User[]) => {
      setOnlineUsers(data);
    });

    socket.emit("userOnline", author);

    return () => {
      socket.disconnect();
    };
  }, []);

  const logOutHandler = async () => {
    try {
      const res = await instance.post("users/logout");
      if (res.data.status === "success") {
        socket.emit("logout", author);
        setAuthor({});
        nav("/login", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const moveChatToFront = (friendId: string) => {
    setFriends((prevFriends) => {
      const friendIndex = prevFriends.findIndex(
        (friend) => friend._id === friendId
      );
      if (friendIndex !== -1) {
        const friend = prevFriends.splice(friendIndex, 1)[0];
        return [friend, ...prevFriends];
      }
      return prevFriends;
    });
  };

  return (
    <DivFollow>
      <Container>
        <Ul>
          {filteredFriends.map((friend) => {
            return (
              <Li key={friend._id}>
                <Link
                  to={`/user/${friend._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <FriendItem
                    _id={friend._id}
                    name={friend.username}
                    userImage={friend.photo}
                    user={friend}
                    isOnline={onlineUsers.some(
                      (user) => user._id === friend._id
                    )}
                    moveChatToFront={moveChatToFront}
                  />
                </Link>
                <Border />
              </Li>
            );
          })}
        </Ul>
      </Container>
      <Border />
      <LogoutDiv>
        <LogoutBtn onClick={logOutHandler}>LOGOUT</LogoutBtn>
      </LogoutDiv>
    </DivFollow>
  );
};

export default FriendsList;
