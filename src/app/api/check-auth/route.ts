import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get('admin_token')?.value;
    const securePassword = process.env.ADMIN_PASSWORD;
    
    const isLoggedIn = !!tokenValue && tokenValue === securePassword;
    
    return NextResponse.json({ isLoggedIn });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, error: "خطا در بررسی کوکی" }, { status: 500 });
  }
}