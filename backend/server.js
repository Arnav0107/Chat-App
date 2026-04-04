import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://chat-app-sigma-seven-16.vercel.app",
    credentials: true,
  }),
);

//socket.io setup

export const io = new Server(httpServer, {
  cors: {
    origin: "https://chat-app-sigma-seven-16.vercel.app",
    credentials: true,
  },
});

const onlineUser = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) onlineUser[userId] = socket.id;
  io.emit("online-users", onlineUser);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete onlineUser[userId];
    io.emit("online-users", onlineUser);
  });
});

export const getReceiverSocketId = (receiverId) => onlineUser[receiverId];


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// DB + Server start
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
