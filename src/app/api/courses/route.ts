// کد نهایی و یکپارچه در مسیر: src/app/api/courses/route.ts

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectToDB } from "./../../../../lib/dbConnect"; 
import Course from "./../../../../models/Course";
import Category from "./../../../../models/Category"; 

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

// ۲. ایجاد دوره جدید (پشتیبانی هوشمند از FormData برای آپلود فایل)
export async function POST(req: Request) {
  try {
    await connectToDB();
    registerModels();
    
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = (formData.get("description") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    
    // 🔍 گرفتن هوشمند فایل ویدیو با هر کلیدی که فرانت‌آند فرستاده باشد
    let videoFile = formData.get("video") as File | null; 
    if (!videoFile) videoFile = formData.get("file") as File | null;
    if (!videoFile) videoFile = formData.get("videoUrl") as File | null;

    let videoUrl = "";

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: "نام دوره و گروه الزامی است" }, { status: 400 });
    }

    // پردازش و ذخیره فایل ویدیو روی هارد سرور در صورت وجود
    if (videoFile && videoFile.size > 0 && typeof videoFile.arrayBuffer === "function") {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      
      // نام‌گذاری امن برای فایل (حذف فاصله‌ها و کاراکترهای غیرمجاز)
      const safeFilename = `${Date.now()}-${videoFile.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
      
      // مسیر ذخیره در پوشه public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, safeFilename);

      // مطمئن می‌شویم پوشه uploads وجود دارد، اگر نبود می‌سازیم
      await mkdir(uploadDir, { recursive: true });
      
      // نوشتن فایل روی هارد سرور
      await writeFile(filePath, buffer);
      
      // آدرسی که در دیتابیس ذخیره می‌شود
      videoUrl = `/uploads/${safeFilename}`;
      console.log("✅ ویدیو با موفقیت ذخیره شد:", videoUrl);
    } else {
      console.log("⚠️ فایلی در ریکوئست یافت نشد؛ دوره بدون ویدیو ساخته می‌شود.");
    }

 // مطمئن شوید در بخش پایانی متد POST ساختار ذخیره‌سازی به این شکل پایدار است:
const course = await Course.create({
  name: name.trim(),
  category: categoryId,
  description: description.trim(),
  duration: duration.trim(),
  videoUrl: videoUrl || "", // 👈 تضمین وجود فیلد در داکیومنت مونگو
});
    const populatedCourse = await Course.findById(course._id).populate("category").lean();
    return NextResponse.json({ success: true, course: populatedCourse });

  } catch (error) {
    console.error("خطا در POST course:", error);
    return NextResponse.json({ success: false, error: "خطا در ایجاد دوره" }, { status: 500 });
  }
}

// ۳. ویرایش دوره
export async function PUT(req: Request) {
  try {
    await connectToDB();
    registerModels();
    
    const body = await req.json();
    const { id, name, categoryId, description, duration } = body;

    if (!id || !name || !categoryId) {
      return NextResponse.json({ success: false, error: "تمامی فیلدها الزامی هستند" }, { status: 400 });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { 
        name: name.trim(), 
        category: categoryId,
        description: description ? description.trim() : "",
        duration: duration ? duration.trim() : ""
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
    bodyParser: false, // غیرفعال کردن بادی‌پارسر پیش‌فرض برای مدیریت دستی FormData
    sizeLimit: "500mb", // افزایش سقف مجاز دریافت فایل تا ۵۰۰ مگابایت
  },
};