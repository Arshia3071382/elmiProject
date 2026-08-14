import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  const studentToken = request.cookies.get('student_token')?.value;

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
      const loginUrl = new URL('/', request.url); // یا صفحه ورود دانش‌آموز
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*'],
};