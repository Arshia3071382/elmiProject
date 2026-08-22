import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز." },
        { status: 401 }
      );
    }

    const student = await Student.findById(token.value);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "دانش‌آموز یافت نشد." },
        { status: 404 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "تکمیل رمز عبور فعلی و جدید الزامی است." },
        { status: 400 }
      );
    }

    // مقایسه رمز فعلی
    const isMatch = await bcrypt.compare(currentPassword, student.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "رمز عبور فعلی اشتباه است." },
        { status: 400 }
      );
    }

    // بررسی قوانین جدید رمز عبور: بین ۶ تا ۸ کاراکتر، شامل عدد، حرف بزرگ و کوچک انگلیسی
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "رمز عبور باید بین ۶ تا ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک و اعداد انگلیسی باشد." 
        },
        { status: 400 }
      );
    }

    // هش کردن و ذخیره رمز عبور جدید
    const salt = await bcrypt.genSalt(12);
    student.passwordHash = await bcrypt.hash(newPassword, salt);
    
    if (!student.username) {
      student.username = student.nationalId || `user_${Date.now()}`;
    }

    await student.save();

    return NextResponse.json({
      success: true,
      message: "رمز عبور با موفقیت تغییر کرد.",
    });
  } catch (err: any) {
    console.error("Password Update Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "خطای سرور." },
      { status: 500 }
    );
  }
}