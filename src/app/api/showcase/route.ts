import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./../../../../lib/dbConnect";
import Showcase from "./../../../../models/Showcase";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    let { title, folder, coverImage, date, description, slug } = body;

    if (!title || !folder) {
      return NextResponse.json(
        { success: false, error: "لطفاً عنوان و نام پوشه را وارد کنید." },
        { status: 400 }
      );
    }

    const cleanFolder = folder.trim();

    const baseSlug = (slug || cleanFolder)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    
    const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // اگر عکس کاور ارسال نشده بود، به جای جستجوی خطاساز در Vercel، 
    // یک مقدار پیش‌فرض امن قرار می‌دهیم یا تلاش می‌کنیم بدون کرش کردن رد شویم
    if (!coverImage) {
      try {
        const searchResult = await cloudinary.search
          .expression(`folder="${cleanFolder}"`)
          .sort_by("created_at", "desc")
          .max_results(1)
          .execute();

        if (searchResult.resources && searchResult.resources.length > 0) {
          coverImage = searchResult.resources[0].public_id;
        }
      } catch (cloudErr: any) {
        console.warn("Cloudinary Search skipped/failed on Vercel, using fallback:", cloudErr?.message);
      }

      // اگر باز هم عکس کاور پیدا نشد، از یک مقدار پیش‌فرض استفاده می‌کنیم تا ارور 400 ندهد
      if (!coverImage) {
        coverImage = `${cleanFolder}/cover`; // یا یک عکس پیش‌فرض دلخواه
      }
    }

    const newAlbum = await Showcase.create({
      title: title.trim(),
      slug: finalSlug,
      folder: cleanFolder,
      coverImage: coverImage.trim(),
      date: date ? date.trim() : "",
      description: description ? description.trim() : "",
    });

    return NextResponse.json({ success: true, data: newAlbum }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error in POST /api/showcase:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const albums = await Showcase.find({}).sort({ createdAt: -1 });
    return NextResponse.json(albums, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت لیست آلبوم‌ها" },
      { status: 500 }
    );
  }
}