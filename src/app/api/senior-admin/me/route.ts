import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; // 🔒 ایمپورت برای اعتبارسنجی توکن امن JWT

import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("senior_admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "احراز هویت نشده‌اید",
        },
        {
          status: 401,
        }
      );
    }

    // 🔒 اعتبارسنجی و رمزگشایی توکن JWT امن
    let username = "";
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
      );
      const { payload } = await jwtVerify(token, secret);
      username = payload.username as string;
    } catch {
      return NextResponse.json(
        {
          error: "توکن نامعتبر یا منقضی شده است",
        },
        {
          status: 401,
        }
      );
    }

    if (!username) {
      return NextResponse.json(
        {
          error: "توکن نامعتبر است",
        },
        {
          status: 401,
        }
      );
    }

    const admin = await SeniorAdmin.findOne({
      username,
      isActive: true,
    }).select("-passwordHash -__v");

    if (!admin) {
      return NextResponse.json(
        {
          error: "کاربر یافت نشد",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
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
      {
        error: "خطایی در سرور رخ داد",
      },
      {
        status: 500,
      }
    );
  }
}