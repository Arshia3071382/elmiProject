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
    const { nationalId, phone, password, firstName, lastName, grade } = body;

    if (!nationalId || !phone || !password) {
      return NextResponse.json({ success: false, message: "کد ملی، شماره تماس و رمز عبور الزامی هستند." }, { status: 400 });
    }

    const cleanNationalId = normalizeNationalId(nationalId);

    if (!isValidNationalId(cleanNationalId)) {
      return NextResponse.json({ success: false, message: "کد ملی وارد شده معتبر نیست." }, { status: 400 });
    }

    // ۱. چک کنیم آیا قبلاً در Student ثبت‌نام کرده است؟
    let existingStudent = await Student.findOne({ nationalId: cleanNationalId });

    if (existingStudent) {
      // اگر حساب دارد، بررسی می‌کنیم رمز عبورش ست شده یا باید لاگین کند
      return NextResponse.json(
        { success: false, message: "این کد ملی قبلاً ثبت‌نام کرده است. لطفاً وارد شوید." },
        { status: 409 }
      );
    }

    // ۲. بررسی جدول لیگ برای اینکه آیا مسئول علمی او را از قبل وارد کرده است؟
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

    // ۳. هش کردن رمز عبور
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // ۴. ساخت حساب کاربری جدید در Student و اتصال به لیگ
    const newStudent = await Student.create({
      firstName: finalFirstName,
      lastName: finalLastName,
      nationalId: cleanNationalId,
      phone: phone.trim(),
      passwordHash,
      grade: finalGrade,
      isActive: true,
      isVerified: true,
      leagueProfile: gradeStudentRecord ? gradeStudentRecord._id : undefined,
    });

    // ۵. لینک دوطرفه با جدول لیگ
    if (gradeStudentRecord) {
      gradeStudentRecord.studentId = newStudent._id;
      await gradeStudentRecord.save();
    }

    // ۶. ست کردن کوکی ورود (StudentToken) و هدایت به داشبورد
    const response = NextResponse.json({
      success: true,
      message: "ثبت‌نام و اتصال به لیگ با موفقیت انجام شد.",
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