//PACKAGE IMPORTS
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //for protectRoute to get cookie from req

//FILE IMPORTS
import { connectDB } from "./lib/db.js"; //named import
import authRoutes from "./routes/auth.routes.js"; //default import
import messageRoutes from "./routes/message.routes.js"; //default import
import userRoutes from "./routes/user.routes.js";

//variables
const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config(); //.env file in root

//middleware
//rootRoute --->  http://localhost:5000
app.use(express.json()); //parse incoming requests with JSON payloads
app.use(cookieParser()); //extract cookie from req in protectRoute

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log("Server running on port 5001");
  connectDB();
});

// app.get("/api/auth/signup", (req, res)=>{
//   console.log("Signup Page");
// })

// Frontend sends JSON text.
// Express middleware parses it into a JS object (req.body).
// Your code destructures that object into variables.

//FRONTEND sends JSON text and app.use(express.json()) converts/parses it into JS objects
