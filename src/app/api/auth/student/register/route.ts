// src/app/api/auth/student/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";
import bcrypt from "bcryptjs";

function isValidNationalId(id: string): boolean {
  if (!/^\d{10}$/.test(id)) return false;
  const check = parseInt(id.substring(9, 10), 10);
  let sum = 0;
  for (let i = 0; i < 9; ++i) {
    sum += parseInt(id.substring(i, i + 1), 10) * (10 - i);
  }
  const rem = sum % 11;
  const computedCheck = rem < 2 ? rem : 11 - rem;
  return computedCheck === check;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { username, nationalId, phone, password, firstName, lastName, grade } = body;

    // ۱. اعتبارسنجی فیلدهای ضروری
    if (!nationalId || !phone || !password) {
      return NextResponse.json({ success: false, message: "کد ملی، شماره تماس و رمز عبور الزامی هستند." }, { status: 400 });
    }

    if (!isValidNationalId(nationalId)) {
      return NextResponse.json({ success: false, message: "کد ملی وارد شده معتبر نیست." }, { status: 400 });
    }

    // ۲. بررسی تکراری نبودن کد ملی یا شماره تماس در جدول دانشجویان
    const existingStudent = await Student.findOne({
      $or: [{ phone: phone.trim() }, { nationalId: nationalId.trim() }],
    });

    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "این کد ملی یا شماره تماس قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    // ۳. بررسی جدول لیگ (GradeStudent)
    const gradeStudentRecord = await GradeStudent.findOne({ nationalId: nationalId.trim() });

    const finalFirstName = gradeStudentRecord?.firstName || firstName?.trim();
    const finalLastName = gradeStudentRecord?.lastName || lastName?.trim();
    const finalGrade = gradeStudentRecord?.grade || Number(grade) || 7;

    if (!gradeStudentRecord && (!finalFirstName || !finalLastName)) {
      return NextResponse.json(
        { success: false, message: "نام و نام خانوادگی برای ثبت‌نام الزامی است." },
        { status: 400 }
      );
    }

    // ۴. هش کردن امن رمز عبور
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // ۵. ایجاد حساب کاربری دانش‌آموز
    const newStudent = await Student.create({
      firstName: finalFirstName,
      lastName: finalLastName,
      nationalId: nationalId.trim(),
      phone: phone.trim(),
      passwordHash,
      grade: finalGrade,
      isActive: true,
      isVerified: !!gradeStudentRecord,
      leagueProfile: gradeStudentRecord ? gradeStudentRecord._id : undefined,
    });

    // ۶. بروزرسانی جدول لیگ
    if (gradeStudentRecord) {
      gradeStudentRecord.studentId = newStudent._id;
      await gradeStudentRecord.save();
    }

    // ۷. ایجاد پاسخ موفقیت‌آمیز همراه با تنظیم کوکی هماهنگ با لاگین (studentToken)
    const response = NextResponse.json({
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد.",
      redirectTo: "/student/dashboard",
      data: {
        phone: newStudent.phone,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
      }
    });

    // نام کوکی دقیقاً باید studentToken باشد تا با داشبورد و لاگین همخوانی داشته باشد
    response.cookies.set("studentToken", newStudent._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // ماندگاری ۷ روزه
    });

    return response;
  } catch (error: any) {
    console.error("Student Registration Error:", error);
    return NextResponse.json({ success: false, message: error.message || "خطای سرور داخلی رخ داد." }, { status: 500 });
  }
}