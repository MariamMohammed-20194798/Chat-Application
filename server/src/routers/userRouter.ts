import express from "express";
import { signup, login, protect, logout } from "./../controller/authController";
import {
  uploadUserPhoto,
  updateMe,
  getAll,
  getMe,
} from "../controller/userController";
export const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/getAllUsers", protect, getAll);
router.get("/getMe", protect, getMe);

router.post("/logout", protect, logout);

router.patch("/updateMe", protect, uploadUserPhoto, updateMe);
