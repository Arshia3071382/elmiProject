import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const isLoggedIn = (await cookieStore).get('admin_logged_in')?.value === 'true';
  
  return NextResponse.json({ isLoggedIn });
}