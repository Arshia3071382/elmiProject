"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers, ChevronLeft, Sparkles } from "lucide-react";

export interface Category {
  _id: string;
  name: string;
}

export interface ICourse {
  _id: string;
  name: string;
  category: Category;
}

interface CategoryCardsProps {
  categories: Category[];
  courses: ICourse[];
  onSelectCategory: (category: Category) => void;
}

export default function CategoryCards({
  categories,
  courses,
  onSelectCategory,
}: CategoryCardsProps) {
  // محاسبه تعداد دوره‌های مربوط به هر دسته‌بندی
  const getCategoryCourseCount = (categoryId: string) => {
    return courses.filter((c) => c.category?._id === categoryId).length;
  };

  return (
    <div className="mt-10">
      {/* هدر بخش انتخاب دوره */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className="text-2xl font-bold flex items-center gap-2"
            style={{ color: "var(--color-primary)", fontFamily: "iranBold" }}
          >
            <Sparkles className="w-6 h-6" style={{ color: "var(--color-secondary)" }} />
            انتخاب دوره آموزشی
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)", fontFamily: "iranSans-r" }}
          >
            جهت مشاهده دروس، لطفاً موضوع مورد نظر خود را انتخاب کنید
          </p>
        </div>
        <span
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
          style={{
            backgroundColor: "#EFF6FF",
            color: "var(--color-secondary)",
            borderColor: "#BFDBFE",
            fontFamily: "iranSans-r",
          }}
        >
          <Layers className="w-4 h-4" />
          {categories.length} موضوع فعال
        </span>
      </div>

      {/* شبکه کارت‌های بزرگ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* کارت ویژه: همه دوره‌ها */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectCategory({ _id: "ALL", name: "همه محتواها" })}
          className="group cursor-pointer relative overflow-hidden rounded-3xl p-7 text-white shadow-xl flex flex-col justify-between min-h-[200px] transition-all duration-300 border border-slate-700/50"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, #0F172A 100%)",
          }}
        >
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7" style={{ color: "var(--color-accent)" }} />
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-xl font-bold" style={{ fontFamily: "iranBold" }}>
              تمامی دوره‌ها
            </h3>
            <div className="flex items-center justify-between mt-4">
              <span
                className="text-sm text-slate-300 flex items-center gap-1.5"
                style={{ fontFamily: "iranSans-r" }}
              >
                {courses.length} دوره آموزشی
              </span>
              <div
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white transition-all"
                style={{ color: "var(--color-primary)" }}
              >
                <ChevronLeft className="w-5 h-5 text-white group-hover:text-slate-900" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* کارت تک تک دسته‌بندی‌ها */}
        {categories.map((cat) => {
          const count = getCategoryCourseCount(cat._id);
          return (
            <motion.div
              key={cat._id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat)}
              className="group cursor-pointer relative overflow-hidden rounded-3xl p-7 shadow-lg flex flex-col justify-between min-h-[200px] transition-all duration-300 border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-blue-50 rounded-full blur-xl group-hover:bg-blue-100/70 transition-all" />

              <div className="relative z-10 flex items-start justify-between">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    backgroundColor: "#F8FAFC",
                    color: "var(--color-secondary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <BookOpen className="w-7 h-7" />
                </div>
              </div>

              <div className="relative z-10 mt-6">
                <h3
                  className="text-xl font-bold transition-colors group-hover:text-blue-600"
                  style={{
                    color: "var(--color-primary)",
                    fontFamily: "iranBold",
                  }}
                >
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "iranSans-r",
                    }}
                  >
                    {count} دوره
                  </span>
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}