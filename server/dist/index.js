"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = require("./routers/userRouter");
const roomRoutes_1 = require("./routers/roomRoutes");
const errorController_1 = __importDefault(require("./controller/errorController"));
// ###########################################################
// Initialize Express app
dotenv_1.default.config({ path: "./.env" });
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.options("*", (0, cors_1.default)());
// Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
app.use(errorController_1.default);
// ###########################################################
// Socket IO server
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let onlineUsers = [];
let newUsers = [];
io.on("connection", (socket) => {
    console.log(`Connection ID: ${socket.id}`);
    socket.on("userSignedUp", async (newUser) => {
        io.emit("usersSignedUp", newUser);
    });
    socket.on("userOnline", async (user) => {
        onlineUsers.push(user);
        io.emit("onlineUsers", onlineUsers);
        io.emit("onlineHeader", onlineUsers);
    });
    socket.on("send_message", async (data) => {
        io.emit("receive_message", data);
    });
    socket.on("room", async (data) => {
        io.emit("receiveRoom", data);
    });
    socket.on("logout", async (data) => {
        const filteredUsers = [];
        onlineUsers.forEach((el) => {
            if (el._id !== data._id) {
                filteredUsers.push(el);
            }
        });
        onlineUsers = filteredUsers;
        io.emit("offline", onlineUsers);
        io.emit("onlineHeader", onlineUsers);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected", socket.id);
    });
});
// ##############################################################
// Development logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use((0, cookie_parser_1.default)());
// ROUTES
app.use("/api/v1/users", userRouter_1.router);
app.use("/api/v1/room", roomRoutes_1.router);
// ##############################################################
// DATABASE CONNECTION
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then(() => console.log("DB Connection Successful!"));
// ##############################################################
//SERVER RUNNING
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`APP RUNNING ON PORT ${port}...`);
});
