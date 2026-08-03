import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";

import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

const LoginSchema = z.object({
  action: z.enum(["check", "set_first_password", "login"]).optional(),

  username: z.string().min(1).max(50),

  password: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "اطلاعات ورودی نامعتبر است",
        },
        {
          status: 400,
        },
      );
    }

    const { action, username, password } = result.data;

    const cleanUsername = username.trim().toLowerCase();

    // فقط کاربران موجود اجازه دارند

    const admin = await SeniorAdmin.findOne({
      username: cleanUsername,

      isActive: true,
    });

    // هیچ ساخت خودکاری وجود ندارد

    if (!admin) {
      return NextResponse.json(
        {
          error: "حساب کاربری یافت نشد",
        },
        {
          status: 404,
        },
      );
    }

    // بررسی اولین ورود

    if (action === "check") {
      return NextResponse.json({
        exists: true,

        isFirstLogin: admin.isFirstLogin || !admin.passwordHash,

        name: admin.name,

        permissions: admin.permissions,

        role: admin.role,
      });
    }

    // تعیین رمز اولین ورود

    if (action === "set_first_password") {
      if (!admin.isFirstLogin) {
        return NextResponse.json(
          {
            error: "رمز عبور قبلاً ثبت شده است",
          },
          {
            status: 400,
          },
        );
      }

      if (!password || password.length < 8) {
        return NextResponse.json(
          {
            error: "رمز عبور باید حداقل ۸ کاراکتر باشد",
          },
          {
            status: 400,
          },
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      admin.passwordHash = hashedPassword;

      admin.isFirstLogin = false;

      admin.lastLoginAt = new Date();

      await admin.save();

      await setAuthCookie(admin.username);

      return NextResponse.json({
        success: true,

        message: "رمز عبور ثبت شد",

        user: {
          username: admin.username,
          name: admin.name,
          permissions: admin.permissions,
          role: admin.role,
        },
      });
    }

    // ورود عادی

    if (action === "login" || !action) {
      if (!admin.passwordHash) {
        return NextResponse.json(
          {
            isFirstLogin: true,
            error: "ابتدا رمز عبور تعیین کنید",
          },
          {
            status: 400,
          },
        );
      }

      if (!password) {
        return NextResponse.json(
          {
            error: "رمز عبور را وارد کنید",
          },
          {
            status: 400,
          },
        );
      }

      const match = await bcrypt.compare(password, admin.passwordHash);

      if (!match) {
        return NextResponse.json(
          {
            error: "رمز عبور اشتباه است",
          },
          {
            status: 401,
          },
        );
      }

      admin.lastLoginAt = new Date();

      await admin.save();

      await setAuthCookie(admin.username);

      return NextResponse.json({
        success: true,

        user: {
          username: admin.username,
          name: admin.name,
          permissions: admin.permissions,
          role: admin.role,
        },
      });
    }

    return NextResponse.json(
      {
        error: "درخواست نامعتبر",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "خطای سرور",
      },
      {
        status: 500,
      },
    );
  }
}

async function setAuthCookie(username: string) {
  const cookieStore = await cookies();

  const token = Buffer.from(
    JSON.stringify({
      username,

      createdAt: Date.now(),
    }),
  ).toString("base64");

  cookieStore.set("senior_admin_token", token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: "strict",

    path: "/",

    maxAge: 60 * 60 * 24 * 7,
  });
}
