import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

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
    const {
      nationalId,
      phone,
      password,
      firstName,
      lastName,
      grade,
      securityQuestion,
      securityAnswer,
    } = body;

    // بررسی اطلاعات اجباری
    if (!nationalId || !phone || !password || !securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { success: false, message: "تمام اطلاعات اجباری شامل سوال و پاسخ امنیتی را وارد کنید." },
        { status: 400 }
      );
    }

    const cleanNationalId = normalizeNationalId(nationalId);
    const cleanPhone = phone.trim();
    const cleanSecurityAnswer = securityAnswer.trim().toLowerCase();
    
    // استخراج و بررسی کد ۶ رقمی پین از پاسخ امنیتی (فرمت: پین-بازیکن)
    const securityPin = cleanSecurityAnswer.split("-")[0];

    if (!/^\d{6}$/.test(securityPin)) {
      return NextResponse.json(
        { success: false, field: "securityPin", message: "کد امنیتی ۶ رقمی نامعتبر است." },
        { status: 400 }
      );
    }

    // تولید خودکار نام کاربری به صورت امن و یکتا بر اساس کد ملی
    const cleanUsername = body.username ? body.username.trim() : `user_${cleanNationalId}`;

    if (!isValidNationalId(cleanNationalId)) {
      return NextResponse.json({ success: false, message: "کد ملی وارد شده معتبر نیست." }, { status: 400 });
    }

    if (cleanSecurityAnswer.length < 5) {
      return NextResponse.json(
        { success: false, message: "پاسخ امنیتی نامعتبر است." },
        { status: 400 }
      );
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

    // ۲. بررسی تکراری نبودن نام کاربری تولید شده
    const existingStudentByUsername = await Student.findOne({ username: cleanUsername });
    if (existingStudentByUsername) {
      return NextResponse.json(
        { 
          success: false, 
          field: "username", 
          message: "این حساب کاربری قبلاً ایجاد شده است." 
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

    // ۴. بررسی تکراری نبودن کد ۶ رقمی امنیتی (یونیک بودن پین)
    const existingStudentByPin = await Student.findOne({ securityPin });
    if (existingStudentByPin) {
      return NextResponse.json(
        { 
          success: false, 
          field: "securityPin", 
          message: "این کد امنیتی ۶ رقمی قبلاً توسط کاربر دیگری انتخاب شده است. لطفاً کد دیگری وارد کنید." 
        },
        { status: 409 }
      );
    }

    // ۵. بررسی جدول لیگ
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

    // ۶. هش کردن ایمن رمز عبور و پاسخ امنیتی
    const passwordHash = await bcrypt.hash(password, 12);
    const securityAnswerHash = await bcrypt.hash(cleanSecurityAnswer, 12);

    // ۷. ساخت حساب کاربری جدید با ذخیره کد پین یکتا
    const newStudent = await Student.create({
      username: cleanUsername,
      firstName: finalFirstName,
      lastName: finalLastName,
      nationalId: cleanNationalId,
      phone: cleanPhone,
      passwordHash,
      securityQuestion: securityQuestion.trim(),
      securityPin, // ذخیره و قفل کردن پین به صورت یکتا
      securityAnswerHash,
      grade: finalGrade,
      isActive: true,
      isVerified: true,
      leagueProfile: gradeStudentRecord ? gradeStudentRecord._id : undefined,
    });

    if (gradeStudentRecord) {
      gradeStudentRecord.studentId = newStudent._id;
      await gradeStudentRecord.save();
    }

    // 🔒 ۸. ساخت توکن JWT امن با هماهنگی کامل نقش و نام‌گذاری
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );
    
    const token = await new SignJWT({ 
      userId: newStudent._id.toString(),
      id: newStudent._id.toString(),
      username: newStudent.username,
      role: "student" 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد.",
      redirectTo: "/student/dashboard",
    });

    // تنظیمات کوکی همسان‌سازی شده با نام student_token
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set("student_token", token, cookieOptions);
    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "خطای سرور داخلی رخ داد." }, { status: 500 });
  }
}