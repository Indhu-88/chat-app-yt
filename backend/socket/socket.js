import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ["http://localhost:3000"], methods: ["GET", "POST"] }, //Ensures only React FE (running on port 3000) can connect.
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; //{userId = socket.Id}, userSocketMap["abc123"] = "socket_1";

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; //userId is authUser._id
  if (userId != "undefined") userSocketMap[userId] = socket.id; //for each authUser = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //keys are authUser._id

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
