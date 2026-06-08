import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/elmi_courses"; 

export async function connectToDB() {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to elmi_courses database successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}