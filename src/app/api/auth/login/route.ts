import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Admin from "./../../../../../models/Admin";
import Student from "./../../../../../models/Student";
import Teacher from "./../../../../../models/Teacher";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "لطفاً نام کاربری و رمز عبور را وارد کنید." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password);

    // تنظیمات استاندارد و امن کوکی (پشتیبانی پویا از لوکال و پروداکشن)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );

    // ----------------------------------------------------
    // ۱. بررسی ادمین (Admin)
    // ----------------------------------------------------
    const admin = await Admin.findOne({
      $or: [{ username: cleanUsername }, { email: cleanUsername }],
    });

    if (admin && (await bcrypt.compare(cleanPassword, admin.password))) {
      const token = await new SignJWT({
        userId: admin._id.toString(),
        username: admin.username,
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      const response = NextResponse.json({
        success: true,
        role: "admin",
        redirectUrl: "/admin/dashboard",
        message: "ورود ادمین با موفقیت انجام شد.",
      });

      response.cookies.set("admin_token", token, cookieOptions);
      response.cookies.set("token", token, cookieOptions);

      return response;
    }

    // ----------------------------------------------------
    // ۲. بررسی استاد (Teacher)
    // ----------------------------------------------------
    const teacher = await Teacher.findOne({
      $or: [{ phone: cleanUsername }, { username: cleanUsername }, { email: cleanUsername }],
    });

    const teacherPasswordHash = teacher?.password || teacher?.passwordHash;

    if (teacher && teacherPasswordHash) {
      const isMatch = await bcrypt.compare(cleanPassword, teacherPasswordHash);
      if (isMatch) {
        const token = await new SignJWT({
          userId: teacher._id.toString(),
          username: teacher.username || teacher.phone,
          role: "teacher",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        const response = NextResponse.json({
          success: true,
          role: "teacher",
          redirectUrl: "/teacher/dashboard",
          message: "ورود استاد با موفقیت انجام شد.",
        });

        response.cookies.set("teacher_token", token, cookieOptions);
        response.cookies.set("token", token, cookieOptions);

        return response;
      }
    }

    // ----------------------------------------------------
    // ۳. بررسی دانش‌آموز (Student)
    // ----------------------------------------------------
    const student = await Student.findOne({
      $or: [
        { phone: cleanUsername },
        { username: cleanUsername },
        { nationalId: cleanUsername }
      ],
    });

    const studentPasswordHash = student?.password || student?.passwordHash;

    if (student && studentPasswordHash) {
      const isMatch = await bcrypt.compare(cleanPassword, studentPasswordHash);
      if (isMatch) {
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
          redirectUrl: "/student/dashboard",
          message: "ورود با موفقیت انجام شد.",
          student: {
            id: student._id.toString(),
            nationalId: student.nationalId || "",
            username: student.username || student.phone || "",
          },
        });

        response.cookies.set("student_token", token, cookieOptions);
        response.cookies.set("token", token, cookieOptions);

        return response;
      }
    }

    return NextResponse.json(
      { success: false, message: "نام کاربری یا رمز عبور اشتباه است." },
      { status: 401 }
    );

  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور داخلی. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}