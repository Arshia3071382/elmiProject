// app/api/contacts/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect";
import Contact from "./../../../../models/Contact";

export async function GET() {
  try {
    await dbConnect();
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, grade, subject, phone, message } = await req.json();

    // اعتبارسنجی تمام فیلدها
    if (!name || !grade || !subject || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "تکمیل تمامی فیلدها الزامی است" },
        { status: 400 }
      );
    }

    // اعتبارسنجی شماره تلفن
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: "شماره تماس نامعتبر است" },
        { status: 400 }
      );
    }

    const newMessage = await Contact.create({ 
      name, 
      grade, 
      subject, 
      phone, 
      message 
    });

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت پیام" },
      { status: 500 }
    );
  }
}