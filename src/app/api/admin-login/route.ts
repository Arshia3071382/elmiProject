import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();


    const securePassword = process.env.ADMIN_PASSWORD;

    const isPasswordCorrect = password === securePassword;

    if (isPasswordCorrect) {
      const cookieStore = await cookies();

      cookieStore.set("admin_logged_in", "true", {
        httpOnly: false, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/", 
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
