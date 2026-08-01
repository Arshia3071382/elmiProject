import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const username = cookieStore.get("senior_admin_token")?.value;

    if (!username) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید." }, { status: 401 });
    }

    const admin = await SeniorAdmin.findOne({ username }).select("-passwordHash");

    if (!admin) {
      return NextResponse.json({ error: "کاربر یافت نشد." }, { status: 404 });
    }

    return NextResponse.json({ user: admin });
  } catch (error) {
    return NextResponse.json({ error: "خطایی رخ داد." }, { status: 500 });
  }
}