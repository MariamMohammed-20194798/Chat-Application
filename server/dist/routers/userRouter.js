"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("./../controller/authController");
const userController_1 = require("../controller/userController");
exports.router = express_1.default.Router();
exports.router.post("/signup", authController_1.signup);
exports.router.post("/login", authController_1.login);
exports.router.get("/getAllUsers", authController_1.protect, userController_1.getAll);
exports.router.get("/getMe", authController_1.protect, userController_1.getMe);
exports.router.post("/logout", authController_1.protect, authController_1.logout);
exports.router.patch("/updateMe", authController_1.protect, userController_1.uploadUserPhoto, userController_1.updateMe);
