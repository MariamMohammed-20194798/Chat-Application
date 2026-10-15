"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authController_1 = require("./../controller/authController");
const userController_1 = require("../controller/userController");
exports.router = express_1.default.Router();
const passwordEmailLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "fail",
        message: "Too many password reset requests. Please try again later.",
    },
});
exports.router.post("/signup", authController_1.signup);
exports.router.post("/login", authController_1.login);
exports.router.post("/forgotPassword", passwordEmailLimiter, authController_1.forgotPassword);
exports.router.patch("/resetPassword", passwordEmailLimiter, authController_1.resetPassword);
exports.router.get("/getAllUsers", authController_1.protect, userController_1.getAll);
exports.router.get("/getMe", authController_1.protect, userController_1.getMe);
exports.router.post("/logout", authController_1.protect, authController_1.logout);
exports.router.patch("/updateMe", authController_1.protect, userController_1.uploadUserPhoto, userController_1.updateMe);
