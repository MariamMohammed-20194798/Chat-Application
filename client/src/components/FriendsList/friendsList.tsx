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
  const [id, setId] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState("");
  const newOnlineUser = useAuthorDataStore((state) => state.setOnlineUsers);
  const update = useAuthorDataStore((state) => state.updatedUsers);
  const setAuthor = useAuthorDataStore((state) => state.setAuthorData);
  const author = useAuthorDataStore((state) => state.authorData);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await instance.get("users/getAllUsers");
      setFriends(res.data.data);
    };
    fetchAllUsers();
  }, [update]);

  useEffect(() => {
    socket.on("onlineUsers", (data: any) => {
      setOnlineUsers(data);
      newOnlineUser(data);
    });
    socket.on("usersSignedUp", (newUser) => {
      console.log(newUser);
      setFriends((prev) => [...prev, newUser]);
    });

    socket.on("offline", (data) => {
      setOnlineUsers(data);
      newOnlineUser(data);
    });

    socket.emit("userOnline", author._id);
  }, [socket]);

  const logOutHandler = async () => {
    try {
      const res = await instance.post("users/logout");
      if (res.data.status === "success") {
        socket.emit("logout", author._id);
        setAuthor({});
        nav("/login", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredFriends = friends?.filter((friend) =>
    friend?.username?.toLowerCase().includes(searchQuery?.toLowerCase())
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
          {filteredFriends.map((user) => {
            return (
              <Li key={user._id}>
                <Link
                  to={`user/${user._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <FriendItem
                    _id={user._id}
                    name={user.username}
                    userImage={user.photo}
                    user={user}
                    isOnline={onlineUsers.some((el: any) => user._id === el)}
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
