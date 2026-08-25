import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("studentToken")?.value;
  const { pathname } = request.nextUrl;

  // اگر کاربر توکن ندارد و می‌خواهد وارد هر بخش از پنل دانش‌آموزی شود
  if (pathname.startsWith("/student")) {
    if (!token) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // اعمال هدرهای ضد کش برای جلوگیری از نمایش صفحه با دکمه Back مرورگر پس از خروج
  if (pathname.startsWith("/student")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
  ],
};