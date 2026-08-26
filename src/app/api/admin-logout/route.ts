import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // پاک‌سازی تمام نام‌های احتمالی کوکی ادمین با تنظیم MaxAge صفر
    const tokenNames = ["admin_token", "admin__token", "adminToken"];
    
    for (const name of tokenNames) {
      cookieStore.set({
        name,
        value: "",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "با موفقیت خارج شدید",
    });

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