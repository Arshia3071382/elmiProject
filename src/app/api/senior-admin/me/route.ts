import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("senior_admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "احراز هویت نشده‌اید" },
        { status: 401 }
      );
    }

    let adminId = "";
    let username = "";

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
      );
      const { payload } = await jwtVerify(token, secret);
      adminId = (payload.userId || payload.id) as string;
      username = payload.username as string;
    } catch {
      // پشتیبانی از حالت قدیمی که کوکی فقط شامل _id ادمین بود (برای جلوگیری از خطای ناگهانی)
      adminId = token;
    }

    let admin = null;
    if (adminId && adminId.length === 24) {
      // اگر مقدار ذخیره شده یک ObjectId معتبر مانگو باشد
      admin = await SeniorAdmin.findById(adminId).select("-passwordHash -__v");
    } else if (username) {
      admin = await SeniorAdmin.findOne({ username, isActive: true }).select("-passwordHash -__v");
    }

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: "کاربر یافت نشد یا غیرفعال است" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: admin.username,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        isFirstLogin: admin.isFirstLogin,
      },
    });
  } catch (error) {
    console.error("ME API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "خطایی در سرور رخ داد" },
      { status: 500 }
    );
  }
}