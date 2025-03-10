import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in .env file");
}

export async function connectDB() {
  try {
    await mongoose.connect(mongoUri as string);
    console.log("* Connected to MongoDB");
  } catch (error) {
    console.error("* MongoDB connection error:", error);
    process.exit(1);
  }
}
