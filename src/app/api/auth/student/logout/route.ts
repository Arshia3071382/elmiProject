import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "با موفقیت خارج شدید.",
  });

  // لیست تمام نام‌های کوکی که ممکن است در بخش‌های مختلف پروژه ست شده باشند
  const allCookies = [
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

  // پاک کردن تک‌تک کوکی‌ها با صفر کردن maxAge و تاریخ انقضا
  for (const cookieName of allCookies) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  // هدرهای ضد کش برای جلوگیری از باز شدن صفحه با دکمه Back مرورگر
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}