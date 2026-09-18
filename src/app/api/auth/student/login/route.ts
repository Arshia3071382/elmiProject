import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "اطلاعات ارسالی نامعتبر است." },
        { status: 400 }
      );
    }

    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "شماره موبایل/نام کاربری و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();
    const genericErrorMessage = "نام کاربری یا رمز عبور اشتباه است.";

    // جستجوی دانش‌آموز بر اساس تلفن، نام کاربری یا کدملی
    const student = await Student.findOne({
      $or: [
        { phone: cleanUsername },
        { username: cleanUsername },
        { nationalId: cleanUsername },
      ],
    });

    const studentPassword = student?.password || student?.passwordHash;

    if (!student || !studentPassword) {
      // محافظت در برابر Timing Attack
      await bcrypt.compare(cleanPassword, "$2a$10$invalidhashvaluetomatchtiming123456789");
      return NextResponse.json({ success: false, error: genericErrorMessage }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(cleanPassword, studentPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: genericErrorMessage }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-very-secure-secret-key-12345"
    );

    const token = await new SignJWT({
      userId: student._id.toString(),
      id: student._id.toString(),
      username: student.username || student.phone,
      role: "student",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      role: "student",
      student: {
        nationalId: student.nationalId,
        phone: student.phone,
      },
      redirectUrl: "/student/dashboard",
      message: "ورود با موفقیت انجام شد.",
    });

    // ست کردن کوکی با نام student_token دقیقاً مطابق با Middleware
    response.cookies.set("student_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (err: any) {
    console.error("Student Login Error:", err);
    return NextResponse.json(
      { success: false, error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}