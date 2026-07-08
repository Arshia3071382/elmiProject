import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // خواندن رمز از فایل محیطی؛ اگر نبود، رمز پیش‌فرض قرار می‌گیرد تا سرور ۵۰۰ ندهد
    const securePassword = process.env.ADMIN_PASSWORD;

    // مقایسه رمز
    const isPasswordCorrect = password === securePassword;

    if (isPasswordCorrect) {
      const cookieStore = await cookies();

      cookieStore.set("admin_logged_in", "true", {
        httpOnly: false, // موقتاً false بگذارید تا فرانت‌آند مطمئن شود مرورگر آن را ذخیره کرده است
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // ۱ هفته
        path: "/", // بسیار مهم: کوکی باید روی کل دامنه معتبر باشد
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "رمز عبور وارد شده نادرست است" },
      { status: 401 },
    );
  } catch (error) {
    console.error("🔴 خطای دقیق سرور:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش سرور" },
      { status: 500 },
    );
  }
}
