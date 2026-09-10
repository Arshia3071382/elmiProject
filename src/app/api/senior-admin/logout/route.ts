import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

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

  // حذف تک‌تک کوکی‌ها از طریق cookieStore
  for (const cookieName of allCookies) {
    cookieStore.delete(cookieName);
  }

  const response = NextResponse.json({
    success: true,
    message: "با موفقیت خارج شدید.",
  });

  // هدرهای ضد کش برای جلوگیری از ماندگاری صفحه در حافظه موقت (bfcache) مرورگر
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}