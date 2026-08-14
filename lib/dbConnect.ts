import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elmi_courses";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobalCache: MongooseCache | undefined;
}

let cached = global.mongooseGlobalCache;

if (!cached) {
  cached = global.mongooseGlobalCache = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI در فایل .env یافت نشد! در حال استفاده از آدرس پیش‌فرض local.");
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ اتصال به دیتابیس MongoDB با موفقیت برقرار شد.");
        return m;
      })
      .catch((err) => {
        cached!.promise = null;
        console.error("❌ خطا در اتصال اولیه به MongoDB:", err);
        throw err;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}

export async function connectToDB() {
  return dbConnect();
}

// اضافه کردن export default برای جلوگیری از خطای ایمپورت در APIها
export default dbConnect;