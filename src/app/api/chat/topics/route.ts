// src/app/api/chat/topics/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import mongoose from "mongoose";

// تعریف مستقیم یا بازخوانی اسکیما برای تضمین ثبت در سیستم کانتینرهای Serverless
const TopicSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, default: "default-topic.png" },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // ۱. اتصال به دیتابیس
    await dbConnect();

    // ۲. بررسی لایه پایداری اتصال
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [API Topics] Database not ready yet, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log("📡 [API Topics] Confirming model registration...");
    
    // ۳. ثبت یا فراخوانی ایمن مدل بدون وابستگی به ایمپورت‌های خارجی لرزان (Tree-shaken)
    const TargetModel = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
    
    console.log("📡 [API Topics] Executing find() query on MongoDB...");
    const allTopicsData = await TargetModel.find({}).sort({ createdAt: 1 }).lean().exec();

    console.log(`✅ [API Topics] Successfully fetched ${allTopicsData?.length || 0} topics`);

    // ۴. ارسال پاسخ به کلاینت همراه هدر ضد کش
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: allTopicsData || [],
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