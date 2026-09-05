import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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

    try {
      const searchResult = await cloudinary.search
        .expression(`folder="${folder.trim()}"`)
        .sort_by("created_at", "desc")
        .max_results(30)
        .execute();

      const images = searchResult.resources.map((file: any) => ({
        public_id: file.public_id,
        secure_url: file.secure_url,
      }));

      return NextResponse.json({ success: true, images }, { status: 200 });
    } catch (cloudErr: any) {
      console.error("Error fetching images from Cloudinary:", cloudErr?.message);
      return NextResponse.json(
        { success: false, error: "خطا در ارتباط با کلادینری. لطفاً متغیرهای محیطی API Secret را بررسی کنید." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}