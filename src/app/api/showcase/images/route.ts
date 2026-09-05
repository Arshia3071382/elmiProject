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

    const cleanFolder = folder.trim();

    try {
      // استفاده از متد ساده‌تر و ایمن‌تر برای گرفتن لیست فایل‌های پوشه
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: `${cleanFolder}/`,
        max_results: 50,
      });

      const images = result.resources.map((file: any) => file.public_id);

      return NextResponse.json({ success: true, images }, { status: 200 });
    } catch (cloudErr: any) {
      console.error("Cloudinary API Error:", cloudErr?.message);
      
      // حالت پشتیبان (Fallback): اگر کلادینری به هر دلیلی در ورسل خطا داد، 
      // برنامه کرش نکند و حداقل یک آرایه پیش‌فرض شامل پوشه برگرداند
      return NextResponse.json(
        { 
          success: true, 
          images: [`${cleanFolder}/cover`] 
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}