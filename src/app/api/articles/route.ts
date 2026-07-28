import { NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect"; // مسیر dbConnect خودتان
import Article from "./../../../../models/Article";  // مسیر مدل خودتان

// اجبار Next.js به عدم کش کردن این Route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, articles },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "خطا در دریافت مقالات" }, { status: 500 });
  }
}