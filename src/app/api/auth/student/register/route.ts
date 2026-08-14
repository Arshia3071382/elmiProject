import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-student-secret-key";

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
      $or: [{ phone }, { nationalId }],
    });

    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "این کد ملی یا شماره تماس قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    // ۳. بررسی اینکه آیا مسئول علمی این کد ملی را در جدول لیگ (GradeStudent) ثبت کرده است یا خیر
    const gradeStudentRecord = await GradeStudent.findOne({ nationalId });

    // تعیین دقیق مقادیر نام، نام خانوادگی و پایه (اولویت با اطلاعات ثبت‌شده توسط مسئول علمی)
    const finalFirstName = gradeStudentRecord?.firstName || firstName?.trim();
    const finalLastName = gradeStudentRecord?.lastName || lastName?.trim();
    const finalGrade = gradeStudentRecord?.grade || Number(grade) || 7;

    // اگر در لیست لیگ نبود و نام/نام خانوادگی هم در فرم وارد نشده بود
    if (!gradeStudentRecord && (!finalFirstName || !finalLastName)) {
      return NextResponse.json(
        { success: false, message: "نام و نام خانوادگی برای ثبت‌نام الزامی است." },
        { status: 400 }
      );
    }

    // ۴. هش کردن امن رمز عبور
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // ۵. ایجاد حساب کاربری دانش‌آموز به همراه اتصال به لیگ (در صورت وجود)
    const newStudent = await Student.create({
      firstName: finalFirstName,
      lastName: finalLastName,
      nationalId,
      phone: phone.trim(),
      passwordHash,
      grade: finalGrade,
      isActive: true,
      isVerified: !!gradeStudentRecord, // اگر مسئول علمی ثبت کرده باشد تایید شده محسوب می‌شود
      leagueProfile: gradeStudentRecord ? gradeStudentRecord._id : undefined,
    });

    // ۶. بروزرسانی جدول لیگ برای اتصال متقابل (StudentId)
    if (gradeStudentRecord) {
      gradeStudentRecord.studentId = newStudent._id;
      await gradeStudentRecord.save();
    }

    // ۷. تولید توکن JWT
    const token = jwt.sign(
      { studentId: newStudent._id.toString(), nationalId: newStudent.nationalId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ۸. تنظیم کوکی امن و هدایت به داشبورد
    const response = NextResponse.json({
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد.",
      redirectTo: "/student/dashboard",
    });

    response.cookies.set({
      name: "student_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Student Registration Error:", error);
    return NextResponse.json({ success: false, message: "خطای سرور داخلی رخ داد." }, { status: 500 });
  }
}