import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get('admin_logged_in')?.value;
    
    const isLoggedIn = cookieValue === 'true';
    
    return NextResponse.json({ isLoggedIn });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, error: "خطا در بررسی کوکی" }, { status: 500 });
  }
}