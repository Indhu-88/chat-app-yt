import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //jwt ->name of cookie
    if (!token) {
      return res.status(401).json({ error: "Unauthorised: No token received" });
    }

    //decoded.userId = userId payload in token = jwt.sign({userId}, process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorised: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    req.user = user; //user is same as object seen in mongoDB  (logged in User)
    next();
  } catch (error) {
    console.log("Error in protectRoute: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
