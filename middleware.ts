import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login' || pathname === '/admin') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    const actualPassword = process.env.ADMIN_PASSWORD;

    // مقایسه توکن با رمز عبور جهت دسترسی به بخش مدیریت
    const isAuthorized = adminToken && actualPassword && adminToken.trim() === actualPassword.trim();

    if (!isAuthorized) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// این قسمت فقط روی مسیرهای ادمین فعال است و به بخش ویدیوها کاری ندارد
export const config = {
  matcher: ['/admin/:path*'],
};