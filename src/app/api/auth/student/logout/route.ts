import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "با موفقیت خارج شدید.",
  });

  // حذف کوکی با صفر کردن زمان انقضا
  response.cookies.set("studentToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}