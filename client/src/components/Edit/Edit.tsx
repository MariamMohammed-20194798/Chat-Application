import React, { useEffect } from "react";
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
  DivInput,
  Input,
} from "./EditStyled";

export interface TypeFieldProps {
  photo: string;
  previewImage: string;
  username: string;
  email: string;
  setUpdated: Function;
  author: any;
  setPhoto: Function;
  setPreviewImage: Function;
  handleClosePhoto: Function;
  usernameChangeHandler: any;
}

const Edit: React.FC<TypeFieldProps> = ({
  setPhoto,
  photo,
  username,
  email,
  setUpdated,
  previewImage,
  setPreviewImage,
  handleClosePhoto,
  usernameChangeHandler,
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
  const showAlert = () => {
    setUpdated(true);
    setTimeout(() => {
      setUpdated(false);
    }, 1500);
  };
  const saveData = async () => {
    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("username", username);
      await instance.patch("users/updateMe", formData);
      handleClosePhoto();
      showAlert();
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
      <DivInput>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          defaultValue={username}
          onChange={usernameChangeHandler}
        />
        <Input
          type="text"
          name="email"
          placeholder="Email"
          defaultValue={email}
        />
      </DivInput>

      <Div>
        <Button onClick={saveData}>Save</Button>
      </Div>
    </DivBlock>
  );
};

export default Edit;
