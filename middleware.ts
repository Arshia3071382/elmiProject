import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get("admin_token")?.value;
  const seniorAdminToken = request.cookies.get("senior_admin_token")?.value;
  
  // بررسی توکن‌های معتبر ادمین یا معین ارشد
  const anyAdminToken = 
    adminToken || 
    seniorAdminToken || 
    request.cookies.get("token")?.value;

  const studentToken = 
    request.cookies.get("token")?.value || 
    request.cookies.get("studentToken")?.value ||
    request.cookies.get("student_token")?.value;

  // محافظت از پنل ادمین (اجازه ورود به ادمین کل یا معین‌های ارشد دارای توکن)
  if (pathname.startsWith("/admin")) {
    if (!anyAdminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // محافظت از پنل معین ارشد
  if (pathname.startsWith("/senior-admin")) {
    if (!anyAdminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // محافظت از پنل دانش‌آموزی
  if (pathname.startsWith("/student")) {
    if (!studentToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*", 
    "/senior-admin", 
    "/senior-admin/:path*", 
    "/student", 
    "/student/:path*"
  ],
};