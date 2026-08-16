import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("studentToken")?.value;
  const { pathname } = request.nextUrl;

  // اگر کاربر توکن ندارد و می‌خواهد وارد پنل شود، هدایت به صفحه اصلی
  if (pathname.startsWith("/student/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/dashboard",
    "/student/dashboard/:path*"
  ],
};