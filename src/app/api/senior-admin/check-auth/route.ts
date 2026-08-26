import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; // 🔒 ایمپورت برای باز کردن توکن
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("senior_admin_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, error: "توکن یافت نشد" }, { status: 401 });
    }

    // 🔒 رمزگشایی توکن و استخراج نام کاربری
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );

    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      return NextResponse.json({ authenticated: false, error: "توکن نامعتبر یا منقضی شده است" }, { status: 401 });
    }

    const username = payload.username;

    if (!username) {
      return NextResponse.json({ authenticated: false, error: "فرمت توکن نامعتبر است" }, { status: 401 });
    }

    await dbConnect();

    const user = await SeniorAdmin.findOne({ username, isActive: true }).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ authenticated: false, error: "کاربر یافت نشد" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("ME API ERROR:", error);
    return NextResponse.json({ authenticated: false, error: "خطا در بررسی سشن" }, { status: 500 });
  }
}