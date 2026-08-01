import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "./../../../../lib/dbConnect";
import Admin from "./../../../../models/Admin";

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
        { success: false, error: "نام کاربری و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();

    // بررسی تعداد کاربران موجود در دیتابیس
    const adminCount = await Admin.countDocuments();

    // 🟢 حالت اول: ثبت‌نام اولین ادمین
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(cleanPassword, 10);
      const newAdmin = await Admin.create({
        username: cleanUsername,
        password: hashedPassword,
      });

      const cookieStore = await cookies();
      cookieStore.set("admin_token", newAdmin._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "حساب ادمین با موفقیت ایجاد شد.",
      });
    }

    // 🔵 حالت دوم: احراز هویت ادمین موجود
    const admin = await Admin.findOne({ username: cleanUsername });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "نام کاربری یا رمز عبور نادرست است." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(cleanPassword, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "نام کاربری یا رمز عبور نادرست است." },
        { status: 401 }
      );
    }

    // تنظیم کوکی ورود
    const cookieStore = await cookies();
    cookieStore.set("admin_token", admin._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Login Server Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطا در پردازش سرور" },
      { status: 500 }
    );
  }
}