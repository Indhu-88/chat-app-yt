import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body; //app.use(express.json())

    //Check for password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password Mismatch" });
    }

    //Check if user already Exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already Exists" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //getprofile pic from API

    const profilePic = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;

    //Create new User
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic,
    });

    if (newUser) {
      // generate token
      generateToken(newUser._id, res);

      //save newUser
      await newUser.save();

      //send to frontend as JSON string over http
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(401).json({ error: "Invalid User data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};

// ------------------------------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //find user
    const user = await User.findOne({ username });

    //compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    ); //if no user then user.password compares with empty string -> throws error

    //if no user or password mismatch return
    if (!user || !isPasswordCorrect) {
      return res.status(201).json({ error: "Invalid username or password" });
    }

    //generate token
    generateToken(user._id, res);

    //send the user to client
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};
// ------------------------------------------------------------------------------
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(501).json({ error: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------------------

//  you’re writing a JavaScript object, but Express converts it into JSON format when sending it to the client.
//if (!user || !isPasswordCorrect) {
// return res.status(201).json({ error: "Invalid username or password" });
// }

// Frontend sends JSON text.
// {
//    "fullName": "jay",
//     "username":"jay_jay",
//     "password":"123456",
//     "confirmPassword":"123456",
//     "gender":"male"
// }

// Express middleware parses it into a JS object (req.body).
// After parsing, req.body is just a JS object:
// {
//    fullName: "jay",
//    username: "jay_jay",
//    password: "123456",
//    confirmPassword: "123456",
//     gender: "male"
// }

// Your code destructures that object into variables.
// const { fullName, username } = req.body;
