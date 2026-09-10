import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../lib/dbConnect";
import Admin from "./../../../../models/Admin";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    // بررسی توکن ادمین یا توکن عمومی
    const tokenValue = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;

    if (!tokenValue) {
      return NextResponse.json({
        isLoggedIn: false,
      });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );

    let adminId = "";
    try {
      const { payload } = await jwtVerify(tokenValue, secret);
      adminId = (payload.userId || payload.id) as string;
    } catch (e) {
      return NextResponse.json({
        isLoggedIn: false,
      });
    }

    if (!adminId) {
      return NextResponse.json({
        isLoggedIn: false,
      });
    }

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return NextResponse.json({
        isLoggedIn: false,
      });
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role || "admin",
      },
    });

  } catch (error) {
    console.error("Check Auth Error:", error);

    return NextResponse.json(
      {
        isLoggedIn: false,
        error: "خطا در بررسی احراز هویت"
      },
      {
        status: 500
      }
    );
  }
}