"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controller/roomController");
const roomController_2 = require("../controller/roomController");
const authController_1 = require("../controller/authController");
exports.router = express_1.default.Router();
//router.post("/:from/:to/send-message", protect, sendMsg);
exports.router.get("/getRoom/:id", authController_1.protect, roomController_1.getRoom);
exports.router.get("/allRooms", authController_1.protect, roomController_2.getLastMsg);
