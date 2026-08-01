import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!folder) {
      return NextResponse.json(
        { success: false, error: "نام پوشه ارسال نشده است." },
        { status: 400 }
      );
    }

    // دریافت لیست تمامی عکس‌های پوشه از Cloudinary
    const result = await cloudinary.search
      .expression(`folder:${folder.trim()}/*`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const images = result.resources.map((res: any) => res.public_id);

    return NextResponse.json({ success: true, images }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching images from Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت تصاویر" },
      { status: 500 }
    );
  }
}