// مسیر فایل: src/app/api/courses/route.ts

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectToDB } from "./../../../../lib/dbConnect"; 
import Course from "./../../../../models/Course";
import Category from "./../../../../models/Category"; 
import { extractAparatEmbedUrl } from "./../../../../lib/aparatUtils";

const registerModels = () => {
  if (!Category) console.log("Category model initialized");
  if (!Course) console.log("Course model initialized");
};

// ۱. دریافت دوره‌ها (مرحله ۸ - ارسال فیلد teacher همراه سایر فیلدها)
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

// ۲. ایجاد دوره جدید (مرحله ۴ - دریافت و ذخیره فیلد teacher در پایگاه‌داده)
export async function POST(req: Request) {
  try {
    await connectToDB();
    registerModels();
    
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = (formData.get("description") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    
    // دریافت فیلد مدرس از formData
    const teacher = (formData.get("teacher") as string) || "";
    
    // مرحله ۶ - لاگ کردن مقدار مدرس قبل از ذخیره‌سازی
    console.log("Trace [POST API] - Received teacher value from formData:", teacher);

    const videoInput = formData.get("video") || formData.get("file") || formData.get("videoUrl");
    let videoUrl = "";

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: "نام دوره و گروه الزامی است" }, { status: 400 });
    }

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
      videoUrl = extractAparatEmbedUrl(videoInput);
      console.log("✅ لینک آپارات پردازش و ذخیره شد:", videoUrl);
    }

    const course = await Course.create({
      name: name.trim(),
      category: categoryId,
      teacher: teacher.trim(), // ذخیره مستقیم در مدل دوره
      description: description.trim(),
      duration: duration.trim(),
      videoUrl: videoUrl || "",
    });

    // مرحله ۶ - لاگ کردن داکیومنت ایجاد شده برای تایید وجود فیلد در دیتابیس
    console.log("Trace [POST API] - Created Course Document in DB:", course);

    const populatedCourse = await Course.findById(course._id).populate("category").lean();
    return NextResponse.json({ success: true, course: populatedCourse });

  } catch (error) {
    console.error("خطا در POST course:", error);
    return NextResponse.json({ success: false, error: "خطا در ایجاد دوره" }, { status: 500 });
  }
}

// ۳. ویرایش دوره (مرحله ۵ - دریافت و ویرایش فیلد teacher)
export async function PUT(req: Request) {
  try {
    await connectToDB();
    registerModels();
    
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = (formData.get("description") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    
    // دریافت فیلد مدرس در درخواست ویرایش
    const teacher = (formData.get("teacher") as string) || "";

    // مرحله ۶ - لاگ کردن مقدار مدرس دریافتی برای ویرایش
    console.log("Trace [PUT API] - Received teacher value for update:", teacher);

    const videoInput = formData.get("video") || formData.get("file") || formData.get("videoUrl");
    let processedVideoUrl = "";

    if (!id || !name || !categoryId) {
      return NextResponse.json({ success: false, error: "تمامی فیلدها الزامی هستند" }, { status: 400 });
    }

    if (videoInput instanceof File && videoInput.size > 0) {
      const buffer = Buffer.from(await videoInput.arrayBuffer());
      const safeFilename = `${Date.now()}-${videoInput.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, safeFilename);

      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, buffer);
      
      processedVideoUrl = `/uploads/${safeFilename}`;
    } else if (typeof videoInput === "string" && videoInput.trim() !== "") {
      processedVideoUrl = extractAparatEmbedUrl(videoInput);
    }

    const updateData: any = {
      name: name.trim(), 
      category: categoryId,
      teacher: teacher.trim(), // به روز رسانی فیلد مدرس
      description: description.trim(),
      duration: duration.trim(),
    };

    if (processedVideoUrl) {
      updateData.videoUrl = processedVideoUrl;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category").lean();

    // مرحله ۶ - لاگ کردن نتیجه نهایی پس از ویرایش
    console.log("Trace [PUT API] - Updated Course Document in DB:", updatedCourse);

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