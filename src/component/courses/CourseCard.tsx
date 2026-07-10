"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Users, GraduationCap, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  category: Category;
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
      <div
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* 🎬 Top section: Intelligent video player or layout placeholder */}
        {course.videoUrl ? (
          <div className="relative h-48 w-full bg-black">
            <video
              src={course.videoUrl}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
            />
            {/* New tag overlay on video */}
            {isNew && (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Sparkles className="w-2.5 h-2.5" />
                جدید
              </div>
            )}
          </div>
        ) : (
          /* fallback if video doesn't exist */
          <div
            className="relative h-24 overflow-hidden"
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

            {/* Graduation Icon */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* New badge fallback */}
            {isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg"
              >
                <Sparkles className="w-2.5 h-2.5" />
                جدید
              </motion.div>
            )}
          </div>
        )}

        {/* Card Content */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
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
              className="text-xs font-medium px-2 py-0.5 rounded-md"
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

          {/* Title */}
          <h3
            className="text-base font-bold mb-2 line-clamp-2 transition-colors group-hover:text-blue-600"
            style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
          >
            {course.name}
          </h3>

          {/* Course description from database */}
          <p
            className="text-xs mb-3 line-clamp-2 h-8"
            style={{
              color: "#475569",
              fontFamily: "iranSans-r",
            }}
          >
            {course.description || "توضیحاتی برای این دوره ثبت نشده است."}
          </p>

          {/* Metadata & Button */}
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

            {/* View Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1"
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontFamily: "iranSans-r",
              }}
            >
              مشاهده
              <ChevronRight className="w-2.5 h-2.5" />
            </motion.button>
          </div>
        </div>

        {/* Bottom hover bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
          style={{ backgroundColor: "#38BDF8" }}
        />
      </div>
    </motion.div>
  );
}