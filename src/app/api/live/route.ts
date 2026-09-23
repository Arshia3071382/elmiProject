// src/app/api/live/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect";
import LiveStream from "./../../../../models/LiveStream";

export async function GET() {
  try {
    await dbConnect();
    
    // پیدا کردن پخش زنده فعلی
    const currentLive = await LiveStream.findOne({ isCurrentLive: true });
    
    // پیدا کردن برنامه‌های بعدی (جدول پخش)
    const upcomingStreams = await LiveStream.find({ isCurrentLive: false }).sort({ createdAt: 1 }).limit(3);

    return NextResponse.json({
      success: true,
      currentLive: currentLive || null,
      upcomingStreams: upcomingStreams || [],
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}