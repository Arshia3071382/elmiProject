import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    // خواندن کوکی ادمین
    const cookieValue = cookieStore.get('admin_logged_in')?.value;
    
    // بررسی اینکه آیا کوکی وجود دارد و مقدار آن 'true' است یا خیر
    const isLoggedIn = cookieValue === 'true';
    
    return NextResponse.json({ isLoggedIn });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, error: "خطا در بررسی کوکی" }, { status: 500 });
  }
}