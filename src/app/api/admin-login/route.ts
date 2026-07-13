import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const securePassword = process.env.ADMIN_PASSWORD;

    if (!securePassword) {
      return NextResponse.json(
        { success: false, error: "تنظیمات رمز عبور در سرور یافت نشد" },
        { status: 500 }
      );
    }

    // مقایسه دقیق بدون حساسیت به فاصله‌های مخفی محیط سرور
    const isPasswordCorrect = password.trim() === securePassword.trim();

    if (isPasswordCorrect) {
      const cookieStore = await cookies();

      // تنظیم کوکی دائمی (بدون maxAge یا expires تا با بستن مرورگر یا گذشت زمان حذف نشود)
      cookieStore.set("admin_token", securePassword.trim(), {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax",
        path: "/", 
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "رمز عبور وارد شده نادرست است" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در پردازش سرور" },
      { status: 500 }
    );
  }
}