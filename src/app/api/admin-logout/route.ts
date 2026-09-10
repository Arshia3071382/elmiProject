import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "با موفقیت خارج شدید",
    });

    // لیست کامل و جامع تمام کوکی‌های احتمالی در تمامی پنل‌ها
    const tokenNames = [
      "token",
      "admin_token",
      "admin__token",
      "adminToken",
      "senior_token",
      "senior_admin_token",
      "seniorToken",
      "teacher_token",
      "teacherToken",
      "student_token",
      "studentToken",
    ];

    // پاک‌سازی کامل تمام کوکی‌ها با تنظیم MaxAge روی صفر
    for (const name of tokenNames) {
      response.cookies.set({
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

    // هدرهای ضد کش برای جلوگیری از ماندگاری صفحه در تاریخچه مرورگر
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