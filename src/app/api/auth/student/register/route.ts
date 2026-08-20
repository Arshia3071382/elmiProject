import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";
import bcrypt from "bcryptjs";

function normalizeNationalId(id: string): string {
  if (!id) return "";
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let normalized = id.trim();
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianNumbers[i], i.toString());
    normalized = normalized.replace(arabicNumbers[i], i.toString());
  }
  return normalized;
}

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

    // بررسی فیلدهای اجباری شامل نام کاربری
    if (!username || !nationalId || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "نام کاربری، کد ملی، شماره تماس و رمز عبور الزامی هستند." },
        { status: 400 }
      );
    }

    const cleanNationalId = normalizeNationalId(nationalId);
    const cleanUsername = username.trim();
    const cleanPhone = phone.trim();

    if (!isValidNationalId(cleanNationalId)) {
      return NextResponse.json({ success: false, message: "کد ملی وارد شده معتبر نیست." }, { status: 400 });
    }

    // ۱. بررسی تکراری نبودن کد ملی
    const existingStudentByNationalId = await Student.findOne({ nationalId: cleanNationalId });
    if (existingStudentByNationalId) {
      return NextResponse.json(
        { 
          success: false, 
          field: "nationalId", 
          message: "این کد ملی قبلاً ثبت‌نام کرده است. لطفاً وارد شوید." 
        },
        { status: 409 }
      );
    }

    // ۲. بررسی تکراری نبودن نام کاربری
    const existingStudentByUsername = await Student.findOne({ username: cleanUsername });
    if (existingStudentByUsername) {
      return NextResponse.json(
        { 
          success: false, 
          field: "username", 
          message: "این نام کاربری قبلاً انتخاب شده است." 
        },
        { status: 409 }
      );
    }

    // ۳. بررسی تکراری نبودن شماره تماس
    const existingStudentByPhone = await Student.findOne({ phone: cleanPhone });
    if (existingStudentByPhone) {
      return NextResponse.json(
        { 
          success: false, 
          field: "phone", 
          message: "این شماره تماس قبلاً ثبت‌نام کرده است. هر شماره تنها مجاز به یک حساب است." 
        },
        { status: 409 }
      );
    }

    // ۴. بررسی جدول لیگ
    const allGradeStudents = await GradeStudent.find({});
    const gradeStudentRecord = allGradeStudents.find(
      (gs) => normalizeNationalId(gs.nationalId) === cleanNationalId
    );

    const finalFirstName = gradeStudentRecord?.firstName || firstName?.trim();
    const finalLastName = gradeStudentRecord?.lastName || lastName?.trim();
    const finalGrade = gradeStudentRecord?.grade || Number(grade) || 7;

    if (!gradeStudentRecord && (!finalFirstName || !finalLastName)) {
      return NextResponse.json(
        { success: false, message: "نام و نام خانوادگی برای ثبت‌نام الزامی است." },
        { status: 400 }
      );
    }

    // ۵. هش کردن ایمن رمز عبور
    const passwordHash = await bcrypt.hash(password, 12);

    // ۶. ساخت حساب کاربری جدید
    const newStudent = await Student.create({
      username: cleanUsername,
      firstName: finalFirstName,
      lastName: finalLastName,
      nationalId: cleanNationalId,
      phone: cleanPhone,
      passwordHash,
      grade: finalGrade,
      isActive: true,
      isVerified: true,
      leagueProfile: gradeStudentRecord ? gradeStudentRecord._id : undefined,
    });

    if (gradeStudentRecord) {
      gradeStudentRecord.studentId = newStudent._id;
      await gradeStudentRecord.save();
    }

    const response = NextResponse.json({
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد.",
      redirectTo: "/student/dashboard",
    });

    response.cookies.set("studentToken", newStudent._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Student Registration Error:", error);
    return NextResponse.json({ success: false, message: error.message || "خطای سرور داخلی رخ داد." }, { status: 500 });
  }
}