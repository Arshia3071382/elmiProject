import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "شماره تماس و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    const student = await Student.findOne({
      $or: [
        { phone: cleanPhone },
        { username: cleanPhone }
      ]
    });
    
    // پیام خطای واحد و امن برای جلوگیری از سوءاستفاده
    const genericErrorMessage = "شماره تماس یا رمز عبور اشتباه است.";

    if (!student || !student.passwordHash) {
      // اجرای هش صوری برای جلوگیری از Timing Attack و یکسان‌سازی زمان پاسخ سرور
      await bcrypt.compare(cleanPassword, "$2a$10$invalidhashvaluetomatchtiming123456789");
      return NextResponse.json(
        { success: false, error: genericErrorMessage },
        { status: 401 }
      );
    }

    // مقایسه امن رمز عبور با هش ذخیره شده
    const isMatch = await bcrypt.compare(cleanPassword, student.passwordHash);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: genericErrorMessage },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
      student: {
        nationalId: student.nationalId || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone || "",
      }
    });

    response.cookies.set("studentToken", student._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { success: false, error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}