import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/elmi_courses";

export async function connectToDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
  }
}



