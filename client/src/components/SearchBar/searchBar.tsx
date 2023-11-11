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
  Img,
  DivPhoto,
} from "./searchBarStyled";
import instance from "../../axios";
//import { FaEdit } from "react-icons/fa";
import FriendsList from "../FriendsList/friendsList";

const SearchBar: React.FC = () => {
  const author = useAuthorDataStore((state) => state.authorData);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPhoto, setOpenPhoto] = useState(false);
  const handleOpenPhoto = () => setOpenPhoto(true);
  const handleClosePhoto = () => setOpenPhoto(false);
  const [photo, setPhoto] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchUserHandler = async () => {
      try {
        const res = await instance.get("users/getMe");
        setPreviewImage(res.data.data.data.photo);
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
          <Img src={previewImage} alt="user" onClick={handleOpenPhoto} />
          {/*  <DivEdit onClick={handleOpenPhoto}>
            <FaEdit size={35} color="white" />
          </DivEdit> */}
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
                setPreviewImage={setPreviewImage}
                previewImage={previewImage}
                handleClosePhoto={handleClosePhoto}
              />
            </BoxDiv>
          </Modal>
        </DivPhoto>
      </Div2>
      <FriendsList searchQuery={searchQuery} />
    </>
  );
};
export default SearchBar;
