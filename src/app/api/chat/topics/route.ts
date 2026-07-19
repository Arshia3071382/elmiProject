// src/app/api/chat/topics/route.ts
import { NextResponse } from "next/server";
import Conversation from "../../../../../models/Conversation";
import dbConnect from "../../../../../lib/dbConnect";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // ۱. ابتدا اتصال به دیتابیس برقرار می‌شود
    await dbConnect();

    // ۲. بررسی خط دفاعی: اگر دیتابیس به هر دلیلی هنوز کامل وصل نشده، منتظر می‌مانیم
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [API Topics] Database not ready yet, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("📡 [API Topics] Executing find() query on MongoDB...");
    
    // ۳. فچ کردن مستقیم داده‌ها به صورت آرایه‌ای از آبجکت‌های خام JSON
    const topics = await Topic.find({}).sort({ createdAt: 1 }).lean().exec();

    console.log(`✅ [API Topics] Successfully fetched ${topics?.length || 0} topics from Vercel Production`);

    if (!topics || topics.length === 0) {
      // اگر دیتابیس خالی است یا کالکشن اشتباه انتخاب شده
      return NextResponse.json({
        success: true,
        data: [],
        message: "Database connected, but collection 'topics' is empty or name mismatched."
      }, { status: 200 });
    }

    // ۴. بازگرداندن پاسخ با هدرهای ضد کش (Anti-Cache)
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: topics,
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