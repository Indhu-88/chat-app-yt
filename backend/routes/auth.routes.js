import express from "express";

import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/signup", (req, res) => {
//    res.send("signup route");    //frontend
//    console.log("SIGNUP");       //backend
// });

//REST API endpoints
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
