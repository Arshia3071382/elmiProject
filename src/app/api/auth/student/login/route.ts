import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "شماره تماس و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    const student = await Student.findOne({
      $or: [
        { phone: cleanPhone },
        { username: cleanPhone }
      ]
    });
    
    const genericErrorMessage = "شماره تماس یا رمز عبور اشتباه است.";

    if (!student || !student.passwordHash) {
      await bcrypt.compare(cleanPassword, "$2a$10$invalidhashvaluetomatchtiming123456789");
      return NextResponse.json(
        { success: false, error: genericErrorMessage },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(cleanPassword, student.passwordHash);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: genericErrorMessage },
        { status: 401 }
      );
    }

    // 🔒 ساخت توکن JWT امن با jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-very-secure-secret-key-12345"
    );
    
    const token = await new SignJWT({ userId: student._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
      student: {
        nationalId: student.nationalId || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone || "",
      }
    });

    // قرار دادن توکن امن در کوکی
    response.cookies.set("studentToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { success: false, error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}