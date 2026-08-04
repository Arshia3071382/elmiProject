import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../lib/dbConnect";
import Admin from "./../../../../models/Admin";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();

    const tokenValue = cookieStore.get("admin_token")?.value;

    if (!tokenValue) {
      return NextResponse.json({
        isLoggedIn: false,
      });
    }


    const admin = await Admin.findById(tokenValue)
      .select("-password");


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
        role: admin.role,
      },
    });


  } catch (error) {

    console.error("Check Auth Error:", error);

    return NextResponse.json(
      {
        isLoggedIn:false,
        error:"خطا در بررسی احراز هویت"
      },
      {
        status:500
      }
    );
  }
}