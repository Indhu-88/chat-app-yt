import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// Wraps your Express app in a raw HTTP server.
const server = http.createServer(app);

// SOCKET SERVER for backend
// Creates a Socket server instance (io) and attaches it to your existing HTTP server
// REST API endpoints (app.get, app.post, etc.) and WebSocket events (io.on("connection", ...))
// both run on the same port/share the same server.
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000"], methods: ["GET", "POST"] }, //Ensures only React FE (running on port 3000) can connect.
});

// send respective socketId for the receiverId
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

//stores socket ids for respective authUsers or logged in users
//basically socket ids of all online users
//socket ids are needed to send msgs
const userSocketMap = {}; //{userId = socket.Id}, userSocketMap["abc123"] = "socket_1";

// listening for connections
// socket object: Represents a specific client’s connection, each client gets its own socket
io.on("connection", (socket) => {
  //socket.handshake.query.userId comes in as a string from the client.
  const userId = socket.handshake.query.userId; //userId is authUser._id
  if (userId != "undefined") userSocketMap[userId] = socket.id; //for each authUser = socket.id

  //io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //keys are authUser._id

  //socket.on() is used to listen to events. Can be used on both FE and BE
  //comes from useLogout.js, socket.disconnect()
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
