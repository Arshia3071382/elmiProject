import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";
import { jwtVerify } from "jose"; // 🔒 ایمپورت برای اعتبارسنجی توکن امن

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

    const { phone } = await req.json();

    // ۱. اعتبارسنجی فرمت شماره موبایل
    if (!phone || !/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل وارد شده معتبر نیست (مثال: 09123456789)." },
        { status: 400 }
      );
    }

    // ۲. بررسی اینکه آیا شماره متعلق به خود کاربر است یا خیر
    if (student.phone === phone) {
      return NextResponse.json(
        { success: true, message: "شماره موبایل تغییر نکرد (شماره قبلی است)." },
      );
    }

    // ۳. بررسی تکراری نبودن شماره در کل دیتابیس (مدل Student)
    const existingStudent = await Student.findOne({ phone });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "این شماره موبایل قبلاً توسط کاربر دیگری ثبت شده است." },
        { status: 400 }
      );
    }

    // ۴. ذخیره شماره جدید روی دانش‌آموز
    student.phone = phone;
    if (!student.username) {
      student.username = student.nationalId || `user_${Date.now()}`;
    }
    await student.save();

    // ۵. به‌روزرسانی همگام در مدل GradeStudent (در صورت وجود)
    if (student.leagueProfile) {
      const gradeRecord = await GradeStudent.findById(student.leagueProfile);
      if (gradeRecord) {
        gradeRecord.phone = phone;
        await gradeRecord.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "شماره موبایل با موفقیت تغییر کرد.",
    });
  } catch (err: any) {
    console.error("Phone Update Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "خطای سرور رخ داد." },
      { status: 500 }
    );
  }
}