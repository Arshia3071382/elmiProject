// src/app/api/admin/live/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import LiveStream from "./../../../../../models/LiveStream";

export async function GET() {
  try {
    await dbConnect();
    const streams = await LiveStream.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, streams });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // اگر این برنامه به عنوان پخش زنده جاری تنظیم شده، بقیه را از حالت جاری خارج کنیم
    if (body.isCurrentLive) {
      await LiveStream.updateMany({}, { isCurrentLive: false });
    }

    const newStream = await LiveStream.create(body);
    return NextResponse.json({ success: true, stream: newStream });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطا در ایجاد برنامه" }, { status: 500 });
  }
}