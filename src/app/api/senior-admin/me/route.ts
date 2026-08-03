import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
        },
      );
    }

    // باز کردن Token

    let session;

    try {
      session = JSON.parse(Buffer.from(token, "base64").toString());
    } catch {
      return NextResponse.json(
        {
          error: "توکن نامعتبر است",
        },
        {
          status: 401,
        },
      );
    }

    const username = session.username;

    if (!username) {
      return NextResponse.json(
        {
          error: "توکن نامعتبر است",
        },
        {
          status: 401,
        },
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
        },
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
      },
    );
  }
}
