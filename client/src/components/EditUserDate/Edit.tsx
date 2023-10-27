import React, { useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import instance from "../../axios";
import {
  DivBlock,
  DivPhoto,
  Img,
  Lable,
  CameraIcon,
  Button,
  Div,
} from "./EditStyled";

export interface TypeFieldProps {
  photo: string;
  previewImage: string;
  author: any;
  setPhoto: Function;
  setPreviewImage: Function;
  handleClosePhoto: Function;
}

const Edit: React.FC<TypeFieldProps> = ({
  setPhoto,
  photo,
  author,
  previewImage,
  setPreviewImage,
  handleClosePhoto,
}) => {
  const photoChangeHandler = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const saveData = async () => {
    try {
      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);
        await instance.patch("users/updateMe", formData);
      }
      handleClosePhoto();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DivBlock>
      <input id="userImage" type="file" onChange={photoChangeHandler} hidden />
      <Lable htmlFor="userImage">
        <CameraIcon>
          <FiCamera />
        </CameraIcon>
        <DivPhoto>
          <Img src={previewImage || ""} alt="user" />
        </DivPhoto>
      </Lable>
      <p>{author.userName}</p>
      <Div>
        <Button onClick={saveData}>Save</Button>
      </Div>
    </DivBlock>
  );
};

export default Edit;
