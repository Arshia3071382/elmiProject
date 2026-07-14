import React from "react";
import mongoose from "mongoose";
import Course from "./../../../../models/Course";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDB } from "./../../../../lib/dbConnect";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourseData(id: string) {
  if (!mongoose.isValidObjectId(id)) return null;

  try {
    await connectToDB();
    const course = await Course.findById(id).lean();
    return course;
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

  const finalVideoUrl = course.videoUrl || "";

  return (
    <div className="min-h-screen bg-gray-50/50 py-10" dir="rtl">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* دکمه بازگشت شیک با تراز چپ و هاور معکوس رنگ‌ها */}
        <div className="mb-8 flex justify-end ">
          <Link
            href="/courses"
            className="group inline-flex flex-row-reverse items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-white hover:text-red-600 rounded-xl border border-red-600 hover:border-red-600 shadow-sm hover:shadow-md hover:shadow-red-100 transition-all duration-200 ease-in-out"
          >
            <ArrowRight className="w-4 h-4 text-white mt-1 rotate-180 group-hover:text-red-600 group-hover:translate-x-1 transition-transform duration-200" />
            <span>بازگشت</span>
          </Link>
        </div>

        {/* ساختار تک‌ستونه متمرکز بر ویدیو */}
        <div className="space-y-6">
          
          {/* بخش اول: ویدیو پلیر عریض و سراسری */}
          {finalVideoUrl ? (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-200/60 bg-black z-10 isolate">
              <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={finalVideoUrl}
                  className="absolute top-0 left-0 w-full h-full z-20 pointer-events-auto"
                  style={{ border: 0 }}
                  title={course.name}
                  allowFullScreen={true}
                  // @ts-ignore
                  webkitallowfullscreen="true"
                  // @ts-ignore
                  mozallowfullscreen="true"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-2">
              <span className="text-sm">
                ویدیویی برای این دوره ثبت نشده است
              </span>
            </div>
          )}

          {/* بخش دوم: اطلاعات و جزئیات زیر ویدیو */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            
            {/* عنوان ویدیو و متادیتا */}
            <div className="border-b border-gray-100 pb-5">
              <h1 className="text-2xl md:text-3xl font-normal text-gray-900 mb-4 font-iranBold leading-tight">
                {course.name}
              </h1>

              {course.duration && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>مدت زمان: {course.duration}</span>
                </div>
              )}
            </div>

            {/* توضیحات مربوط به ویدیو */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 font-iranBold">
                توضیحات و سرفصل‌ها
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