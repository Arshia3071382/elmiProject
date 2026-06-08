// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // بررسی اینکه آیا کاربر می‌خواهد وارد صفحات ادمین شود
  if (pathname.startsWith('/admin')) {
    const isLoggedIn = request.cookies.get('admin_logged_in')?.value === 'true';

    // اگر لاگین نکرده بود، بلافاصله هدایت شود به صفحه اصلی
    if (!isLoggedIn) {
      // استفاده از absolute URL برای ریدایرکت ایمن
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// تنظیم متچر به طوری که تمام زیرمسیرهای admin را هم پوشش دهد
export const config = {
  matcher: ['/admin/:path*'],
};