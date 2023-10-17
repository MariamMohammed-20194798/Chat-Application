import express from "express";
import { signup, login } from "./../controller/authController";
import {
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  getAll,
} from "../controller/userController";
export const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/getAllUsers", getAll);

router.patch("/:id/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
