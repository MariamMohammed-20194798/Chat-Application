"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const RoomModel_1 = __importDefault(require("./models/RoomModel"));
// ###########################################################
// Socket IO server
const server = http_1.default.createServer(app_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let onlineUsers = new Set();
io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
    });
    socket.on("updatePhoto", async (user) => {
        console.log(user);
        io.emit("updateUserPhoto", user);
    });
    socket.on("userSignedUp", async (newUser) => {
        console.log(newUser);
        io.emit("usersSignedUp", newUser);
    });
    socket.on("userOnline", async (user) => {
        onlineUsers.add(user);
        io.emit("onlineUsers", [...onlineUsers]);
    });
    socket.on("logout", async (data) => {
        onlineUsers.delete(data);
        io.emit("offline", [...onlineUsers]);
    });
    socket.on("send_message", async (data) => {
        socket.to(data.roomId).emit("receive_message", data);
        await RoomModel_1.default.findByIdAndUpdate(data.roomId, {
            $push: {
                messages: {
                    text: data.text,
                    from: data.from,
                    to: data.to,
                    createdAt: data.createdAt,
                },
            },
        });
    });
});
// DATABASE CONNECTION
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then(() => console.log("DB Connection Successful!"));
//SERVER RUNNING
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`APP RUNNING ON PORT ${port}...`);
});
