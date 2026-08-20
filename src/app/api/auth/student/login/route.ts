import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";

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
    
    if (!student) {
      return NextResponse.json(
        { success: false, error: "کاربری با این مشخصات یافت نشد." },
        { status: 401 }
      );
    }

    if (!student.passwordHash) {
      return NextResponse.json(
        { success: false, error: "حساب کاربری فاقد رمز عبور است." },
        { status: 401 }
      );
    }

    // مقایسه امن رمز عبور با هش ذخیره شده
    const isMatch = await bcrypt.compare(cleanPassword, student.passwordHash);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

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

    response.cookies.set("studentToken", student._id.toString(), {
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
      { success: false, error: err.message || "خطای سرور." },
      { status: 500 }
    );
  }
}