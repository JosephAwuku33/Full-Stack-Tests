import mongoose from "mongoose";
import { config } from "./config";

const MONGODB_URI = config.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not defined in env");
  
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
