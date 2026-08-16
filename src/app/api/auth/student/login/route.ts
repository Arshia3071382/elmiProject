// src/app/api/auth/student/login/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "شماره تماس و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    // جستجوی دانش‌آموز بر اساس فیلد phone
    const student = await Student.findOne({ phone: phone.trim() });
    
    if (!student || !student.passwordHash) {
      return NextResponse.json(
        { success: false, error: "شماره تماس یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    // مقایسه رمز عبور با فیلد passwordHash
    const isMatch = await bcrypt.compare(password, student.passwordHash);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "شماره تماس یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    // ایجاد پاسخ موفقیت‌آمیز
    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
      data: {
        phone: student.phone,
        firstName: student.firstName,
        lastName: student.lastName
      }
    });

    // ست کردن کوکی امن برای جلوگیری از مشکل پریدن لاگین در رفرش‌های موبایل
    response.cookies.set("studentToken", student._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // ماندگاری ۷ روزه
    });

    return response;

  } catch (err: any) {
    console.error("Detailed Login Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "خطای سرور در پردازش درخواست." },
      { status: 500 }
    );
  }
}