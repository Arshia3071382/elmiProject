import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("senior_admin_token")?.value;

    if (!token) {
      console.log("Senior Admin Auth Error: Cookie 'senior_admin_token' not found.");
      return NextResponse.json({ authenticated: false, error: "توکن یافت نشد" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );

    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      console.error("Senior Admin Token Verify Error:", err);
      return NextResponse.json({ authenticated: false, error: "توکن نامعتبر یا منقضی شده است" }, { status: 401 });
    }

    const username = payload.username;

    if (!username) {
      console.log("Senior Admin Auth Error: Username missing in token payload.");
      return NextResponse.json({ authenticated: false, error: "فرمت توکن نامعتبر است" }, { status: 401 });
    }

    await dbConnect();

    // بررسی موقت: اگر شک دارید فیلد isActive برابر با true است یا نه، می‌توانید آن را فعلاً بردارید
    const user = await SeniorAdmin.findOne({ username }).select("-passwordHash");

    if (!user) {
      console.log(`Senior Admin Auth Error: User '${username}' not found in database.`);
      return NextResponse.json({ authenticated: false, error: "کاربر یافت نشد" }, { status: 401 });
    }

    if (user.isActive === false) {
      console.log(`Senior Admin Auth Error: User '${username}' is inactive.`);
      return NextResponse.json({ authenticated: false, error: "حساب کاربری غیرفعال است" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("ME API CRITICAL ERROR:", error);
    return NextResponse.json({ authenticated: false, error: "خطا در بررسی سشن" }, { status: 500 });
  }
}