import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("admin_token")?.value;

    // بررسی وجود کوکی ورود
    const isLoggedIn = Boolean(tokenValue && tokenValue.trim().length > 0);

    return NextResponse.json({ isLoggedIn });
  } catch (error) {
    console.error("Check Auth Error:", error);
    return NextResponse.json(
      { isLoggedIn: false, error: "خطا در بررسی وضعیت ورود" },
      { status: 500 }
    );
  }
}