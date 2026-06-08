import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from './../../../../lib/dbConnect';
import Admin from './../../../../models/Admin';

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { password } = await req.json();

    const admin = await Admin.findOne();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "ادمین یافت نشد" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // ایجاد پاسخ
    const response = NextResponse.json({ success: true });
    
    // ست کردن کوکی
    response.cookies.set({
      name: 'admin_logged_in',
      value: 'true',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24 ساعت
      sameSite: 'lax',
    });
    
    console.log("✅ کوکی ست شد"); // برای دیباگ
    
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}