import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  // اصلاح نام کوکی برای هماهنگی کامل با لاگین دانش‌آموز
  const studentToken = request.cookies.get('studentToken')?.value;

  // مدیریت مسیرهای ادمین
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/')) {
    if (!adminToken) {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // مدیریت مسیرهای پنل دانش‌آموز
  if (pathname.startsWith('/student/')) {
    if (!studentToken) {
      const loginUrl = new URL('/', request.url); 
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*'],
};