import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0, 
  });
  
  const response = NextResponse.json({ success: true });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}