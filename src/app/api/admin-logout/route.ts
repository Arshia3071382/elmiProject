import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: 'admin_logged_in',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0, 
  });
  
  
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}