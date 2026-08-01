import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // پاک‌سازی قطعی کوکی با مشخص کردن path و ویژگی‌های امنیتی
    cookieStore.delete({
      name: "admin_token",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const response = NextResponse.json({
      success: true,
      message: "با موفقیت خارج شدید",
    });

    // جلوگیری کامل از کش شدن پاسخ خروج
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در خروج از حساب" },
      { status: 500 }
    );
  }
}