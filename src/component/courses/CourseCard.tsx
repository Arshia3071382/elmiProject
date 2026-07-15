"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Users, GraduationCap, ChevronLeft, Play, User } from "lucide-react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  category: Category;
  teacher?: string; // اضافه شدن فیلد استاد
  description?: string;
  videoUrl?: string;
  createdAt: string;
}

interface CourseCardProps {
  course: Course;
  idx: number;
  clientTime: number | null;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export default function CourseCard({
  course,
  idx,
  clientTime,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: CourseCardProps) {
  const isNew = clientTime
    ? new Date(course.createdAt).getTime() > clientTime - 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="group"
    >
      <Link href={`/courses/${course._id}`} className="block">
        <div
          className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* 🎬 بخش بالایی: کاور هوشمند */}
          {course.videoUrl ? (
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-slate-800" />
              
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 text-white fill-white mr-0.5" />
              </div>

              <div className="absolute bottom-3 right-3 z-10">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1.5">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              </div>

              {isNew && (
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-2.5 h-2.5" />
                  جدید
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative h-48 overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: "#1F3A5F" }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)",
                }}
              ></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>

              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>

              {isNew && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-2.5 h-2.5" />
                  جدید
                </div>
              )}
            </div>
          )}

          {/* محتوای کارت */}
          <div className="p-4">
            {/* دسته‌بندی و نام استاد */}
            <div className="flex items-center justify-between mb-2.5">
              {/* گروه */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "#EFF6FF" }}
                >
                  <BookOpen
                    className="w-2.5 h-2.5"
                    style={{ color: "#2563EB" }}
                  />
                </div>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    fontFamily: "iranSans-r",
                  }}
                >
                  {course.category && typeof course.category === "object"
                    ? course.category.name || "بدون گروه"
                    : "بدون گروه"}
                </span>
              </div>

              {/* نام استاد */}
              {course.teacher && (
                <div className="flex items-center gap-1 text-gray-500">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] font-medium" style={{ fontFamily: "iranSans-r" }}>
                    {course.teacher}
                  </span>
                </div>
              )}
            </div>

            {/* عنوان */}
            <h3
              className="text-base font-bold mb-2 line-clamp-2 transition-colors group-hover:text-blue-600"
              style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
            >
              {course.name}
            </h3>

            {/* توضیحات */}
            <p
              className="text-xs mb-3 line-clamp-2 h-8"
              style={{
                color: "#475569",
                fontFamily: "iranSans-r",
              }}
            >
              {course.description || "توضیحاتی برای این دوره ثبت نشده است."}
            </p>

            {/* بخش پایانی کارت */}
            <div
              className="flex items-center justify-between pt-3 border-t"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs"
                  style={{
                    color: "#94A3B8",
                    fontFamily: "iranSans-r",
                  }}
                >
                  {new Date(course.createdAt).toLocaleDateString("fa-IR")}
                </span>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" style={{ color: "#94A3B8" }} />
                  <span
                    className="text-xs"
                    style={{
                      color: "#94A3B8",
                      fontFamily: "iranSans-r",
                    }}
                  >
                    ۱۲۴
                  </span>
                </div>
              </div>

              <div
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 hover:bg-blue-700"
                style={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  fontFamily: "iranSans-r",
                }}
              >
                <span>مشاهده</span>
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* نوار افکت هاور پایینی */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
            style={{ backgroundColor: "#38BDF8" }}
          />
        </div>
      </Link>
    </motion.div>
  );
}