import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/elmi_courses";

// کش کردن اتصال برای جلوگیری از اتصال مجدد در هر درخواست
let isConnected = false;

export async function dbConnect() {
  if (isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    console.log("✅ Using existing mongoose connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to elmi_courses database successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

// برای استفاده در فایل‌های دیگر
export async function connectToDB() {
  return dbConnect();
}

// اکسپورت دیفالت برای استفاده ساده‌تر
export default dbConnect;