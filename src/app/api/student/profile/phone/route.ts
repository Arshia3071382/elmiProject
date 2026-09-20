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
    // پشتیبانی از نام‌های مختلف کوکی برای جلوگیری از خطای دسترسی غیرمجاز (401)
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

    // ۳. بررسی دقیق یکتا بودن شماره موبایل در کل دیتابیس (جلوگیری از تکرار در سایر کاربران)
    const existingStudent = await Student.findOne({ 
      phone: phone, 
      _id: { $ne: studentId } // مطمئن شویم متعلق به کاربر دیگری است
    });

    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "این شماره موبایل قبلاً توسط کاربر دیگری ثبت شده است. لطفاً شماره دیگری وارد کنید." },
        { status: 400 }
      );
    }

    const updateData: any = { phone };
    if (!student.username) {
      updateData.username = student.nationalId || `user_${Date.now()}`;
    }

    // ۴. آپدیت امن اطلاعات بدون درگیر شدن با خطاهای اعتبارسنجی سایر فیلدها (مثل securityPin)
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    // ۵. به‌روزرسانی همگام در مدل GradeStudent (در صورت وجود پروفایل لیگ)
    if (updatedStudent && updatedStudent.leagueProfile) {
      const gradeRecord = await GradeStudent.findById(updatedStudent.leagueProfile);
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