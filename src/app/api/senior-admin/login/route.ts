import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "./../../../../../lib/dbConnect";
import Admin from "./../../../../../models/Admin";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "نام کاربری و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // ۱. جستجوی کاربر با این نام کاربری در دیتابیس
    let user = await Admin.findOne({ username: cleanUsername });

    // 🟢 ۲. اگر این کاربر هنوز در دیتابیس وجود ندارد (ثبت‌نام بار اول)
    if (!user) {
      // بررسی اینکه آیا کلا کاریری وجود دارد یا این اولین ثبت‌نام است
      const hashedPassword = await bcrypt.hash(cleanPassword, 10);
      
      user = await Admin.create({
        username: cleanUsername,
        password: hashedPassword,
        role: "senior_moein",
      });

      const cookieStore = await cookies();
      cookieStore.set("admin_token", user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          role: "senior_moein",
        },
      });
    }

    // 🔵 ۳. اگر کاربر وجود دارد، بررسی درست بودن رمز عبور
    const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "نام کاربری یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    // تنظیم کوکی ورود
    const cookieStore = await cookies();
    cookieStore.set("admin_token", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        role: "senior_moein",
      },
    });
  } catch (error) {
    console.error("Senior Login Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در برقراری ارتباط با سرور." },
      { status: 500 }
    );
  }
}