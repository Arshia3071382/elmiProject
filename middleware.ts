import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;

  // ۱. اگر کاربر لاگین کرده باشد و قصد دیدن صفحه لاگین را داشته باشد، مستقیماً به داشبورد هدایت شود
  if (pathname === '/admin/login' && adminToken) {
    const dashboardUrl = new URL('/admin', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // ۲. استثنا قرار دادن صفحه لاگین از بررسی توکن دسترسی
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // ۳. بررسی دسترسی مسیرهای زیرمجموعه /admin
  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};