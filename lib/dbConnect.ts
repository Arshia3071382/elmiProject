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
  if (cached!.conn) {
    console.log("✅ Using existing database connection (cached)");
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("⏳ Initializing new MongoDB connection...");
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ Connected to database successfully!");
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }

  return cached!.conn;
}

export async function connectToDB() {
  return dbConnect();
}

export default dbConnect;