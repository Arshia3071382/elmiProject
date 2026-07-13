import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // پاک کردن قطعی کوکی با هر دو متد برای اطمینان در تمام مرورگرها
  cookieStore.delete("admin_token");
  cookieStore.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0, 
  });
  
  const response = NextResponse.json({ success: true });
  
  // جلوگیری از کش شدن وضعیت ورود در مرورگر
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}