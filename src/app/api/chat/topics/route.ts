// src/app/api/chat/topics/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../../lib/dbConnect";
import Topic from "./../../../../../models/Topic";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // ۱. ابتدا اتصال به دیتابیس برقرار می‌شود
    await dbConnect();

    // ۲. بررسی وضعیت اتصال دیتابیس برای محیط‌های Serverless
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [API Topics] Database not ready yet, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("📡 [API Topics] Executing find() query on MongoDB...");
    
    // فراخوانی مستقیم از مدل‌های ثبت شده در Mongoose برای جلوگیری از تداخل نام با متغیر پایین
    const TargetModel = mongoose.models.Topic || mongoose.model("Topic");
    
    // ۳. فچ کردن داده‌ها (نام متغیر را تغییر دادیم تا با نام مدل تداخل تایپ‌اسکریپتی نداشته باشد)
    const allTopicsData = await TargetModel.find({}).sort({ createdAt: 1 }).lean().exec();

    console.log(`✅ [API Topics] Successfully fetched ${allTopicsData?.length || 0} topics`);

    if (!allTopicsData || allTopicsData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Database connected, but collection 'topics' is empty."
      }, { status: 200 });
    }

    // ۴. بازگرداندن پاسخ با هدرهای ضد کش (Anti-Cache)
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