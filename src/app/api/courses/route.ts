// src/app/api/courses/route.ts

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectToDB } from "./../../../../lib/dbConnect"; 
import Course from "./../../../../models/Course";
import Category from "./../../../../models/Category"; 
import { extractAparatEmbedUrl } from "./../../../../lib/aparatUtils"; // 👈 ایمپورت تابع هوشمند کمکی

// تابع کمکی برای رجیستر شدن حتمی مدل‌ها در Mongoose
const registerModels = () => {
  if (!Category) console.log("Category model initialized");
  if (!Course) console.log("Course model initialized");
};

// ۱. دریافت دوره‌ها
export async function GET(req: Request) {
  try {
    await connectToDB();
    registerModels();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = {};
    if (category) {
      query = { category };
    }

    const courses = await Course.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, courses: Array.isArray(courses) ? courses : [] });
  } catch (error) {
    console.error("خطا در GET courses:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت دوره‌ها", courses: [] }, { status: 500 });
  }
}

// ۲. ایجاد دوره جدید (پشتیبانی از FormData برای آپلود و پردازش هوشمند لینک ویدیو)
export async function POST(req: Request) {
  try {
    await connectToDB();
    registerModels();
    
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = (formData.get("description") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    
    // گرفتن مقدار فیلد ویدیو (فایل یا متن)
    const videoInput = formData.get("video") || formData.get("file") || formData.get("videoUrl");
    let videoUrl = "";

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: "نام دوره و گروه الزامی است" }, { status: 400 });
    }

    // بررسی اینکه ورودی ویدیو فایل است یا متن (لینک آپارات)
    if (videoInput instanceof File && videoInput.size > 0) {
      const buffer = Buffer.from(await videoInput.arrayBuffer());
      const safeFilename = `${Date.now()}-${videoInput.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, safeFilename);

      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, buffer);
      
      videoUrl = `/uploads/${safeFilename}`;
      console.log("✅ ویدیو آپلود شده با موفقیت ذخیره شد:", videoUrl);
    } else if (typeof videoInput === "string" && videoInput.trim() !== "") {
      // ⚡️ اگر ورودی متن بود، آن را از فیلتر پردازشگر هوشمند آپارات عبور می‌دهیم
      videoUrl = extractAparatEmbedUrl(videoInput);
      console.log("✅ لینک آپارات پردازش و ذخیره شد:", videoUrl);
    }

    const course = await Course.create({
      name: name.trim(),
      category: categoryId,
      description: description.trim(),
      duration: duration.trim(),
      videoUrl: videoUrl || "",
    });

    const populatedCourse = await Course.findById(course._id).populate("category").lean();
    return NextResponse.json({ success: true, course: populatedCourse });

  } catch (error) {
    console.error("خطا در POST course:", error);
    return NextResponse.json({ success: false, error: "خطا در ایجاد دوره" }, { status: 500 });
  }
}

// ۳. ویرایش دوره (با پشتیبانی کامل و پردازش هوشمند لینک ویدیو)
export async function PUT(req: Request) {
  try {
    await connectToDB();
    registerModels();
    
    const body = await req.json();
    const { id, name, categoryId, description, duration, videoUrl } = body;

    if (!id || !name || !categoryId) {
      return NextResponse.json({ success: false, error: "تمامی فیلدها الزامی هستند" }, { status: 400 });
    }

    // ⚡️ پردازش و تمیز کردن هوشمند لینک آپارات قبل از ذخیره در دیتابیس
    const processedVideoUrl = videoUrl ? extractAparatEmbedUrl(videoUrl) : "";

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { 
        name: name.trim(), 
        category: categoryId,
        description: description ? description.trim() : "",
        duration: duration ? duration.trim() : "",
        videoUrl: processedVideoUrl // ذخیره لینک پردازش شده نهایی
      },
      { new: true, runValidators: true }
    ).populate("category").lean();

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error("خطا در PUT course:", error);
    return NextResponse.json({ success: false, error: "خطا در ویرایش دوره" }, { status: 500 });
  }
}

// ۴. حذف دوره
export async function DELETE(req: Request) {
  try {
    await connectToDB();
    registerModels();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "شناسه دوره الزامی است" }, { status: 400 });
    }

    await Course.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطا در DELETE course:", error);
    return NextResponse.json({ success: false, error: "خطا در حذف دوره" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "500mb",
  },
};