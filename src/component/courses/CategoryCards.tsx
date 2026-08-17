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
     
      {/* شبکه کارت‌های بزرگ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* کارت ویژه: همه دوره‌ها */}
       
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