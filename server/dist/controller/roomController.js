"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMsg = exports.getRoom = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const RoomModel_1 = __importDefault(require("../models/RoomModel"));
exports.getRoom = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a, _b, _c, _d;
    let room = await RoomModel_1.default.findOne({
        participants: { $all: [(_a = req.user) === null || _a === void 0 ? void 0 : _a.id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.id] },
    });
    let statusCode = 200;
    if (!room) {
        room = await RoomModel_1.default.create({
            participants: [(_c = req.user) === null || _c === void 0 ? void 0 : _c.id, (_d = req.params) === null || _d === void 0 ? void 0 : _d.id],
        });
        statusCode = 201;
    }
    res.status(statusCode).json({
        room,
    });
});
exports.getLastMsg = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const rooms = await RoomModel_1.default.find().select({
        messages: { $slice: -1 },
        users: 0,
        _id: 0,
        __v: 0,
    });
    const data = rooms.flatMap((el) => el.messages);
    res.status(200).json({
        status: "success",
        data,
    });
});
