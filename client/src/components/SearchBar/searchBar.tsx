// SearchBar.tsx
import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { useAuthorDataStore } from "../../Storage/authorStorage";
import Modal from "@mui/material/Modal";
import Edit from "../Edit/Edit";

import {
  Form,
  DivIcon,
  Input,
  Div2,
  BoxDiv,
  DivFaEdit,
  DivPhoto,
} from "./searchBarStyled";
import instance from "../../axios";
import FriendsList from "../FriendsList/friendsList";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Stack from "@mui/material/Stack";

const SearchBar: React.FC = () => {
  const author = useAuthorDataStore((state) => state.authorData);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPhoto, setOpenPhoto] = useState(false);
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [updated, setUpdated] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleOpenPhoto = () => setOpenPhoto(true);
  const handleClosePhoto = () => {
    setOpenPhoto(false);
    setUpdated(false);
  };

  const usernameChangeHandler = (e: any) => {
    setUsername(e.target.value);
  };
  useEffect(() => {
    const fetchUserHandler = async () => {
      try {
        const res = await instance.get("users/getMe");
        setPreviewImage(res.data.data.data.photo);
        setUsername(res.data.data.data.username);
        setEmail(res.data.data.data.email);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserHandler();
  }, []);
  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Div2>
        <Form>
          <DivIcon>
            <IoIosSearch />
          </DivIcon>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={searchHandler}
          />
        </Form>
        <DivPhoto>
          <DivFaEdit onClick={handleOpenPhoto} />

          <Modal
            open={openPhoto}
            onClose={handleClosePhoto}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <BoxDiv>
              <Edit
                author={author}
                setPhoto={setPhoto}
                photo={photo}
                username={username}
                email={email}
                setPreviewImage={setPreviewImage}
                setUpdated={setUpdated}
                previewImage={previewImage}
                handleClosePhoto={handleClosePhoto}
                usernameChangeHandler={usernameChangeHandler}
              />
            </BoxDiv>
          </Modal>
        </DivPhoto>
      </Div2>
      {updated && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert
            style={{
              fontWeight: "bold",
              color: "hotpink",
              border: "none",
              marginLeft: "1rem",
              marginTop: "-3.3rem",
              fontSize: "1.1rem",
            }}
            variant="outlined"
            severity="success"
            iconMapping={{
              success: (
                <CheckCircleOutlineIcon
                  style={{ color: "hotpink" }}
                  fontSize="inherit"
                />
              ),
            }}
          >
            Your Data Updated Successfully !!
          </Alert>
        </Stack>
      )}
      <FriendsList searchQuery={searchQuery} />
    </>
  );
};
export default SearchBar;
