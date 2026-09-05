import { NextResponse } from "next/server";
import connectDB from "./../../../../lib/dbConnect";
import Showcase from "./../../../../models/Showcase";

export const dynamic = "force-dynamic";

// دریافت لیست آلبوم‌ها (GET)
export async function GET() {
  try {
    await connectDB();
    const albums = await Showcase.find({}).sort({ createdAt: -1 });
    return NextResponse.json(albums, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error in GET /api/showcase:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت لیست آلبوم‌ها" },
      { status: 500 }
    );
  }
}

// ثبت آلبوم جدید (POST) - بدون وابستگی به Cloudinary Admin API و خطای سکرت
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

    // اگر عکس کاور به صورت دستی داده نشده بود، به صورت خودکار یک public_id استاندارد از پوشه می‌سازد
    // بدون اینکه نیاز به جستجوی API و کلید Secret داشته باشد
    const finalCoverImage = coverImage && coverImage.trim() !== "" 
      ? coverImage.trim() 
      : `${cleanFolder}/cover`;

    const newAlbum = await Showcase.create({
      title: title.trim(),
      slug: finalSlug,
      folder: cleanFolder,
      coverImage: finalCoverImage,
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