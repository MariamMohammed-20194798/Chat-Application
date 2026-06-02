import "./loadEnv";
import http from "http";
import { app } from "./app";
import { Server } from "socket.io";
import { connectDatabase } from "./lib/supabase";
import { insertMessage } from "./services/roomService";
import { upsertPresence } from "./services/userService";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Set<string>();

io.on("connection", (socket) => {
  socket.on("join_room", (data: string) => {
    socket.join(data);
  });

  socket.on("updatePhoto", async (user: { _id?: string; photo?: string }) => {
    io.emit("updateUserPhoto", user);
  });

  socket.on("userSignedUp", async (newUser: { _id?: string }) => {
    io.emit("usersSignedUp", newUser);
  });

  socket.on("userOnline", async (user: string | { _id?: string }) => {
    const userId = typeof user === "string" ? user : user?._id;
    if (!userId) return;
    onlineUsers.add(userId);
    await upsertPresence(userId, true);
    io.emit("onlineUsers", [...onlineUsers]);
  });

  socket.on("logout", async (data: string) => {
    onlineUsers.delete(data);
    await upsertPresence(data, false);
    io.emit("offline", [...onlineUsers]);
  });

  socket.on(
    "send_message",
    async (data: {
      roomId: string;
      text: string;
      from: string;
      to: string;
      createdAt?: string;
    }) => {
      socket.to(data.roomId).emit("receive_message", data);

      try {
        await insertMessage({
          roomId: data.roomId,
          text: data.text,
          from: data.from,
          to: data.to,
          createdAt: data.createdAt
            ? new Date(data.createdAt).toISOString()
            : undefined,
        });
      } catch (err) {
        console.error("Failed to persist message:", err);
      }
    }
  );
});

connectDatabase().catch((err) => {
  console.error("Database connection failed:", err);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port}...`);
});

export { io };
