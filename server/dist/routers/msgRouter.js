"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const msgController_1 = require("../controller/msgController");
const authController_1 = require("../controller/authController");
exports.router = express_1.default.Router();
exports.router.post("/:from/:to/send-message", authController_1.protect, msgController_1.sendMsg);
/* router.get("/:id", getConvById);
router.get("/:id/getLastMsg", getMessageById); */
