// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is accessing admin routes
  if (pathname.startsWith('/admin')) {
    const isLoggedIn = request.cookies.get('admin_logged_in')?.value === 'true';

    // Redirect to home if unauthorized
    if (!isLoggedIn) {
      // Use absolute URL for secure redirection
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Match all admin sub-routes
export const config = {
  matcher: ['/admin/:path*'],
};