import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // اگر کاربر داشت صفحه لاگین ادمین را باز می‌کرد، کاری نداشته باش و اجازه بده صفحه باز شود
  if (pathname === '/admin/login' || pathname === '/admin') {
    return NextResponse.next();
  }

  // محافظت از بقیه مسیرهای داخل ادمین (مثل داشبورد، مدیریت دوره‌ها و...)
  if (pathname.startsWith('/admin')) {
    const isLoggedIn = request.cookies.get('admin_logged_in')?.value === 'true';

    // اگر لاگین نکرده بود، بفرستش به صفحه لاگین ادمین
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url); // یا آدرس دقیق صفحه لاگین شما
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// اعمال روی تمام زیرمسیرهای ادمین
export const config = {
  matcher: ['/admin/:path*'],
};