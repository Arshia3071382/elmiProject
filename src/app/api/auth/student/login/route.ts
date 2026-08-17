// src/app/api/auth/student/login/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "شماره تماس و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ phone: phone.trim() });
    
    if (!student || !student.passwordHash) {
      return NextResponse.json(
        { success: false, error: "شماره تماس یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "شماره تماس یا رمز عبور اشتباه است." },
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
      },
      data: {
        nationalId: student.nationalId || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
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
    console.error("Detailed Login Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "خطای سرور در پردازش درخواست." },
      { status: 500 }
    );
  }
}