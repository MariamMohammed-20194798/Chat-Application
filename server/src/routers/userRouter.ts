import express from "express";
import rateLimit from "express-rate-limit";
import {
  signup,
  login,
  protect,
  logout,
  forgotPassword,
  resetPassword,
} from "./../controller/authController";
import {
  uploadUserPhoto,
  updateMe,
  getAll,
  getMe,
} from "../controller/userController";
export const router = express.Router();

const passwordEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many password reset requests. Please try again later.",
  },
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", passwordEmailLimiter, forgotPassword);
router.patch("/resetPassword", passwordEmailLimiter, resetPassword);

router.get("/getAllUsers", protect, getAll);
router.get("/getMe", protect, getMe);

router.post("/logout", protect, logout);

router.patch("/updateMe", protect, uploadUserPhoto, updateMe);
