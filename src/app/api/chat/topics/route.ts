// src/app/api/chat/topics/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // ۱. اتصال به دیتابیس
    await dbConnect();

    // ۲. اطمینان از آمادگی کامل کانکشن
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // بررسی وجود دیتابیس برای رفع خطای تایپ‌اسکریپت
    const activeDb = mongoose.connection.db;
    if (!activeDb) {
      console.error("❌ [API Topics] Database connection established but 'db' object is undefined.");
      return NextResponse.json({ success: false, error: "Database context is unavailable" }, { status: 500 });
    }

    // 🔍 لایه عیب‌یابی: لیست کردن تمام کالکشن‌های موجود در دیتابیسی که Vercel به آن وصل شده
    const collections = await activeDb.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("🔍 [Debug DB] Available collections in live DB:", collectionNames);

    // ۳. فچ کردن مستقیم از درایور بومی دیتابیس بدون واسطه سفت و سخت Mongoose
    console.log("📡 [API Topics] Executing native driver query on 'topics'...");
    const nativeData = await activeDb.collection("topics").find({}).sort({ createdAt: 1 }).toArray();
    
    // تبدیل تمیز ObjectId به string برای جلوگیری از خطای رندر کلاینت
    const allTopicsData = nativeData.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));

    console.log(`✅ [API Topics] Native fetch found ${allTopicsData?.length || 0} topics`);

    // ۴. ارسال ریسپانس نهایی
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: allTopicsData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("❌ [API Topics] Critical Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch topics",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}