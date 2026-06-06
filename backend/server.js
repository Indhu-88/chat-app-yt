//PACKAGE IMPORTS
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //for protectRoute to get cookie from req

//FILE IMPORTS
import { connectDB } from "./lib/db.js"; //named import
import authRoutes from "./routes/auth.routes.js"; //default import
import messageRoutes from "./routes/message.routes.js"; //default import
import userRoutes from "./routes/user.routes.js";
import { app, server } from "./socket/socket.js";

//variables
const PORT = process.env.PORT || 5000;

dotenv.config(); //.env file in root

//middleware
//rootRoute --->  http://localhost:5000
app.use(express.json()); //parse incoming requests with JSON payloads/strings into JS Object
app.use(cookieParser()); //extract cookie from req in protectRoute

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  console.log("Server running on port 5000");
  connectDB();
});

// Frontend sends JSON text  ---> body: JSON.stringify({ username, password })

// Express middleware parses it into a JS object (req.body).
// const { username, password } = req.body;
// Your code destructures that object into variables.

//FRONTEND sends JSON text and app.use(express.json()) converts/parses it into JS objects

// app.get("/api/auth/signup", (req, res)=>{
//   console.log("Signup Page");
// })
