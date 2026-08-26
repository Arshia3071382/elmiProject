import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "با موفقیت خارج شدید" });
  
  // منقضی کردن کوکی studentToken
  response.cookies.set({
    name: "studentToken",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}