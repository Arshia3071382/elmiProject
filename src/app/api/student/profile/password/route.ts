import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import { jwtVerify } from "jose"; // 🔒 ایمپورت برای اعتبارسنجی توکن امن

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    // پشتیبانی از نام‌های مختلف کوکی برای جلوگیری از خطای دسترسی غیرمجاز
    const token = 
      cookieStore.get("studentToken") || 
      cookieStore.get("student_token") || 
      cookieStore.get("token");

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز. لطفاً دوباره وارد شوید." },
        { status: 401 }
      );
    }

    // 🔒 رمزگشایی و اعتبارسنجی توکن JWT امن
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );

    let studentId = "";
    try {
      const { payload } = await jwtVerify(token.value, secret);
      studentId = payload.userId as string;
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر یا منقضی شده است. لطفاً دوباره وارد شوید." },
        { status: 401 }
      );
    }

    const student = await Student.findById(studentId);
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

    // هش کردن رمز عبور جدید
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const updateData: any = { passwordHash: hashedPassword };
    if (!student.username) {
      updateData.username = student.nationalId || `user_${Date.now()}`;
    }

    // استفاده از findByIdAndUpdate برای جلوگیری از خطاهای اعتبارسنجی سایر فیلدها (مثل securityPin)
    await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: false }
    );

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