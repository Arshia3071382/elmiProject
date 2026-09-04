// مسیر فایل: src/app/courses/[id]/page.tsx
import React from "react";
import mongoose from "mongoose";
import Course from "./../../../../models/Course";
import { Clock, ArrowRight, User, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDB } from "./../../../../lib/dbConnect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourseData(id: string) {
  if (!mongoose.isValidObjectId(id)) return null;

  try {
    await connectToDB();
    const course = await Course.findById(id).lean();
    if (!course) return null;

    return {
      _id: String(course._id),
      name: course.name || "",
      teacher: course.teacher || "", // دریافت مدرس
      duration: course.duration || "", 
      videoUrl: course.videoUrl || "",
      description: course.description || "",
      createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : null,
    };
  } catch (error) {
    console.error("خطا در واکشی اطلاعات دوره:", error);
    return null;
  }
}

export default async function CoursePlayerPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourseData(id);

  if (!course) {
    notFound();
  }

  // مرحله ۹ - قرار دادن لاگ قبل از return خروجی صفحه جزئیات دوره
  console.log("Trace [CoursePlayerPage Server Component] - Course data:", course);

  const finalVideoUrl = course.videoUrl || "";

  const formattedPublishDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 mt-10 sm:mt-30" dir="rtl">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* دکمه بازگشت */}
        <div className="mb-8 flex justify-start">
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-red-600 rounded-xl border border-gray-200 shadow-sm transition-all duration-200"
          >
            <div className="flex flex-row-reverse items-center gap-2">
              <span>بازگشت به دوره‌ها</span>
            <ArrowRight className="w-4 h-4 mt-0.5 text-gray-500 group-hover:text-red-600 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* ساختار محتوا */}
        <div className="space-y-6">
          
          {/* ویدیو پلیر آپارات */}
          {finalVideoUrl ? (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-200/60 bg-black z-10 isolate">
              <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={finalVideoUrl}
                  className="absolute top-0 left-0 w-full h-full z-20"
                  style={{ border: 0 }}
                  title={course.name}
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-2">
              <span className="text-sm">
                ویدیویی برای این دوره ثبت نشده است.
              </span>
            </div>
          )}

          {/* باکس جزئیات دوره */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            
            {/* عنوان و متادیتا */}
            <div className="border-b border-gray-100 pb-5">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {course.name}
              </h1>

              {/* ردیف تگ‌ها */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* نام مدرس زیر عنوان */}
                {course.teacher && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span>مدرس: {course.teacher}</span>
                  </div>
                )}

                {/* تاریخ انتشار */}
                {formattedPublishDate && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>انتشار: {formattedPublishDate}</span>
                  </div>
                )}

                {/* مدت زمان */}
                {course.duration && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>مدت: {course.duration}</span>
                  </div>
                )}
                
              </div>
            </div>

            {/* توضیحات */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                توضیحات دوره
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {course.description || "توضیحاتی برای این دوره وارد نشده است."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}