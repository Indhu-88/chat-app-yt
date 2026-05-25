import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, //  xss/cross-site scripting attacks (users cannot access this via JS at client side)
    sameSite: "strict", //cross-site forgery attacks
    secure: process.env.NODE_ENV !== "development", //true for production
  });
};

export default generateToken;

//reload window : ctrl+ shift + p   Developer: Reload Window

// Why Protect Routes?
// - Authentication enforcement: After signup/login, users get a JWT (stored in a cookie or header).
// - Protect route middleware ensures only requests with a valid token can access certain endpoints.
// - Security: Without protection, anyone could hit sensitive routes (like /update-profile, /messages, /logout)
//   without being logged in.
// - User context: Protect route middleware decodes the JWT, verifies it, and attaches the authenticated
//   user object to req.user. That way, controllers know who is making the request.
// - Access control: You can extend protect route to check roles/permissions (e.g., admin-only routes).
