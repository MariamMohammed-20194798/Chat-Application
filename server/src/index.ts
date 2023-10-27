// IMPORTS
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routers/userRouter";
import { router as roomRoutes } from "./routers/roomRoutes";
import globalErrorHandler from "./controller/errorController";
import { IUser } from "./models/UserModel";

// ###########################################################
// Initialize Express app
dotenv.config({ path: "./.env" });
const app = express();
app.use(json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.options("*", cors());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(globalErrorHandler);
// ###########################################################
// Socket IO server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers: IUser[] = [];
let newUsers: IUser[] = [];
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
    const filteredUsers: any = [];
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
  app.use(morgan("dev"));
}
app.use(cookieParser());
// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/room", roomRoutes);
// ##############################################################
// DATABASE CONNECTION

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB Connection Successful!"));
// ##############################################################

//SERVER RUNNING
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port}...`);
});
