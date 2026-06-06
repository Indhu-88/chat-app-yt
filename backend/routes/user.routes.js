import express from "express";
import { getUsersForSidebar } from "../controllers/user.controller.js"; //named import
import protectRoute from "../middleware/protectRoute.js"; //default import

const router = express.Router();

// app.use("/api/users", userRoutes); from server.js
router.get("/", protectRoute, getUsersForSidebar);

export default router;
