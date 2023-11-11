// IMPORTS
import http from "http";
import { app } from "./app";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Room from "./models/RoomModel";
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

    await Room.findByIdAndUpdate(data.roomId, {
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
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("DB Connection Successful!"));

//SERVER RUNNING
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port}...`);
});
