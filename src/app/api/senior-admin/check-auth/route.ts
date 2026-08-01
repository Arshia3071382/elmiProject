import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("senior_admin_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await dbConnect();

    const user = await SeniorAdmin.findOne({ username: token }).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, error: "خطا در بررسی سشن" }, { status: 500 });
  }
}