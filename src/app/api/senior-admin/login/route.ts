import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { action, username, password } = body;

    const cleanUsername = username?.trim().toLowerCase();

    if (!cleanUsername) {
      return NextResponse.json({ error: "نام کاربری الزامی است." }, { status: 400 });
    }

    let admin = await SeniorAdmin.findOne({ username: cleanUsername });

    // ساخت اتوماتیک کاربر davood جهت تست در صورت عدم وجود
    if (!admin && cleanUsername === "davood") {
      admin = await SeniorAdmin.create({
        username: "davood",
        name: "داوود",
        permissions: ["calendar", "notices"],
        isFirstLogin: true,
      });
    }

    if (!admin) {
      return NextResponse.json({ error: "حساب کاربری با این نام یافت نشد." }, { status: 404 });
    }

    // ۱. بررسی وضعیت نام کاربری
    if (action === "check") {
      return NextResponse.json({
        exists: true,
        isFirstLogin: admin.isFirstLogin,
        name: admin.name,
      });
    }

    // ۲. ثبت رمز عبور برای بار اول (ذخیره در MongoDB)
    if (action === "set_first_password") {
      if (!password || password.length < 4) {
        return NextResponse.json({ error: "رمز عبور باید حداقل ۴ کاراکتر باشد." }, { status: 400 });
      }

      // هش کردن رمز عبور
      const hashedPassword = await bcrypt.hash(password, 10);

      // ذخیره در مونگو و تغییر وضعیت isFirstLogin
      admin.passwordHash = hashedPassword;
      admin.isFirstLogin = false;
      await admin.save();

      // ست کردن کوکی ورود
      const cookieStore = await cookies();
      cookieStore.set("senior_admin_token", admin.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        message: "رمز عبور اختصاصی شما با موفقیت در دیتابیس ثبت شد.",
        user: {
          username: admin.username,
          name: admin.name,
          permissions: admin.permissions,
        },
      });
    }

    // ۳. لاگین در ورودهای بعدی
    if (action === "login" || !action) {
      if (admin.isFirstLogin) {
        return NextResponse.json({
          isFirstLogin: true,
          error: "لطفاً ابتدا برای حساب خود رمز عبور تعیین کنید."
        }, { status: 400 });
      }

      if (!password) {
        return NextResponse.json({ error: "رمز عبور را وارد کنید." }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash || "");

      if (!isMatch) {
        return NextResponse.json({ error: "رمز عبور اشتباه است." }, { status: 401 });
      }

      const cookieStore = await cookies();
      cookieStore.set("senior_admin_token", admin.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        user: {
          username: admin.username,
          name: admin.name,
          permissions: admin.permissions,
        },
      });
    }

    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "خطایی در سرور رخ داده است." }, { status: 500 });
  }
}