import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get("admin_token")?.value || request.cookies.get("token")?.value;
  const seniorAdminToken = request.cookies.get("senior_admin_token")?.value;
  const teacherToken = request.cookies.get("teacher_token")?.value || request.cookies.get("token")?.value;
  const studentToken = request.cookies.get("student_token")?.value || request.cookies.get("token")?.value;

  // محافظت از پنل ادمین کل
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // محافظت از پنل مدیر ارشد
  if (pathname.startsWith("/senior-admin")) {
    if (!seniorAdminToken && !adminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // محافظت از پنل اساتید
  if (pathname.startsWith("/teacher")) {
    if (!teacherToken && !adminToken) {
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
    "/teacher",
    "/teacher/:path*",
    "/student",
    "/student/:path*"
  ],
};