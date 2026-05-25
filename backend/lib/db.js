import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected: ", conn.connection.host); //hostname of the MongoDB server
  } catch (error) {
    console.log("MongoDB Connection Error: ", error.message);
  }
};

//.env file in root and not in backend
