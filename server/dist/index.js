"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("./loadEnv");
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const supabase_1 = require("./lib/supabase");
const roomService_1 = require("./services/roomService");
const userService_1 = require("./services/userService");
const server = http_1.default.createServer(app_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io = io;
const onlineUsers = new Set();
io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
    });
    socket.on("updatePhoto", async (user) => {
        io.emit("updateUserPhoto", user);
    });
    socket.on("userSignedUp", async (newUser) => {
        io.emit("usersSignedUp", newUser);
    });
    socket.on("userOnline", async (user) => {
        const userId = typeof user === "string" ? user : user === null || user === void 0 ? void 0 : user._id;
        if (!userId)
            return;
        onlineUsers.add(userId);
        await (0, userService_1.upsertPresence)(userId, true);
        io.emit("onlineUsers", [...onlineUsers]);
    });
    socket.on("logout", async (data) => {
        onlineUsers.delete(data);
        await (0, userService_1.upsertPresence)(data, false);
        io.emit("offline", [...onlineUsers]);
    });
    socket.on("send_message", async (data) => {
        socket.to(data.roomId).emit("receive_message", data);
        try {
            await (0, roomService_1.insertMessage)({
                roomId: data.roomId,
                text: data.text,
                from: data.from,
                to: data.to,
                createdAt: data.createdAt
                    ? new Date(data.createdAt).toISOString()
                    : undefined,
            });
        }
        catch (err) {
            console.error("Failed to persist message:", err);
        }
    });
});
(0, supabase_1.connectDatabase)().catch((err) => {
    console.error("Database connection failed:", err);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`APP RUNNING ON PORT ${port}...`);
});
