import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Admin from "./../../../../../../models/Admin";
import SeniorAdmin from "./../../../../../../models/SeniorAdmin";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  await dbConnect();

  try {
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
        { success: false, error: "نام کاربری و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();
    const genericErrorMessage = "نام کاربری یا رمز عبور اشتباه است.";

    // ----------------------------------------------------
    // ۱. بررسی ادمین کل (Admin) و حالت ثبت‌نام اولین ادمین
    // ----------------------------------------------------
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(cleanPassword, 10);
      const newAdmin = await Admin.create({
        username: cleanUsername,
        password: hashedPassword,
      });

      const response = NextResponse.json({
        success: true,
        role: "admin",
        redirectUrl: "/admin",
        message: "حساب ادمین با موفقیت ایجاد شد.",
      });

      response.cookies.set("admin_token", newAdmin._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return response;
    }

    const admin = await Admin.findOne({ username: cleanUsername });
    if (admin && admin.password) {
      const isMatch = await bcrypt.compare(cleanPassword, admin.password);
      if (isMatch) {
        const response = NextResponse.json({
          success: true,
          role: "admin",
          redirectUrl: "/admin",
        });
        response.cookies.set("admin_token", admin._id.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        return response;
      }
    }

    // ----------------------------------------------------
    // ۲. بررسی معین‌های ارشد (SeniorAdmin)
    // ----------------------------------------------------
    const seniorAdmin = await SeniorAdmin.findOne({ username: cleanUsername });
    if (seniorAdmin && seniorAdmin.password) {
      const isMatch = await bcrypt.compare(cleanPassword, seniorAdmin.password);
      if (isMatch) {
        const response = NextResponse.json({
          success: true,
          role: "senior-admin",
          redirectUrl: "/senior-admin",
        });
        response.cookies.set("senior_admin_token", seniorAdmin._id.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
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
        { nationalId: cleanUsername },
      ],
    });

    // پشتیبانی همزمان از password و passwordHash بر اساس اسکیمای دیتابیس
    const studentPassword = student?.password || student?.passwordHash;

    if (student && studentPassword) {
      const isMatch = await bcrypt.compare(cleanPassword, studentPassword);
      if (isMatch) {
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

        response.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    // جلوگیری از Timing Attack در صورت پیدا نشدن کاربر
    await bcrypt.compare(cleanPassword, "$2a$10$invalidhashvaluetomatchtiming123456789");
    return NextResponse.json(
      { success: false, error: genericErrorMessage },
      { status: 401 }
    );

  } catch (err: any) {
    console.error("Unified Login Error:", err);
    return NextResponse.json(
      { success: false, error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}