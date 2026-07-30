import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const envUsername = process.env.SENIOR_MOEIN_USERNAME;
    const envPassword = process.env.SENIOR_MOEIN_PASSWORD;

    if (!envUsername || !envPassword) {
      return NextResponse.json(
        { success: false, error: "تنظیمات اعتبارنامه‌ها در سرور یافت نشد." },
        { status: 500 }
      );
    }

    // بررسی دقیق نام کاربری و رمز عبور
    if (username === envUsername && password === envPassword) {
      return NextResponse.json({
        success: true,
        user: {
          username: envUsername,
          role: "senior_moein",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "نام کاربری یا رمز عبور اشتباه است." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "خطا در برقراری ارتباط با سرور." },
      { status: 500 }
    );
  }
}