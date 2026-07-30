"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import Container from "./../../component/Container";

import CourseHero from "./../../component/courses/CourseHero";
import CategoryCards from "./../../component/courses/CategoryCards";
import CourseCard from "./../../component/courses/CourseCard";
import StatsSummary from "./../../component/courses/StatsSummary";

export interface Category {
  _id: string;
  name: string;
}

export interface ICourse {
  _id: string;
  name: string;
  category: Category;
  teacher?: string;
  duration?: string;
  description?: string;
  videoUrl?: string;
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clientTime, setClientTime] = useState<number | null>(null);

  useEffect(() => {
    fetchInitialData();
    setClientTime(Date.now());
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [catRes, courseRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/courses"),
      ]);
      const catData = await catRes.json();
      const courseData = await courseRes.json();

      if (catData.success) setCategories(catData.categories);
      if (courseData.success && Array.isArray(courseData.courses)) {
        setCourses(courseData.courses);
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات:", error);
    } finally {
      setLoading(false);
    }
  };

  // فیلتر کردن دوره‌ها بر اساس دسته‌بندی انتخاب‌شده در فرانت
  const filteredCourses =
    selectedCategory && selectedCategory._id !== "ALL"
      ? courses.filter((c) => c.category?._id === selectedCategory._id)
      : courses;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Container>
        <main dir="rtl" className="py-8">
          {/* Header Section */}
          <CourseHero />

          <AnimatePresence mode="wait">
            {loading ? (
              /* لودینگ */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div
                    className="w-12 h-12 border-4 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"
                    style={{
                      borderColor: "var(--color-secondary)",
                      borderTopColor: "transparent",
                    }}
                  ></div>
                </div>
                <p
                  className="mt-4 text-sm"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "iranSans-r" }}
                >
                  در حال بارگذاری دوره‌ها...
                </p>
              </motion.div>
            ) : !selectedCategory ? (
              /* -------------------------------------------------------------
                 مرحله اول: کارت‌های بزرگ دسته‌بندی (قبل از نمایش ویدیوها)
                 ------------------------------------------------------------- */
              <motion.div
                key="category-cards"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CategoryCards
                  categories={categories}
                  courses={courses}
                  onSelectCategory={setSelectedCategory}
                />
              </motion.div>
            ) : (
              /* -------------------------------------------------------------
                 مرحله دوم: لیست ویدیوها/دوره‌های مربوط به دسته انتخابی
                 ------------------------------------------------------------- */
              <motion.div
                key="course-list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* نوار راهنما و دکمه بازگشت */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl border shadow-sm"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-slate-200"
                      style={{
                        backgroundColor: "#F1F5F9",
                        color: "var(--color-text-secondary)",
                        fontFamily: "iranSans-r",
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      بازگشت به دسته‌بندی‌ها
                    </button>
                    <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />
                    <h2
                      className="text-lg font-bold flex items-center gap-2"
                      style={{ color: "var(--color-primary)", fontFamily: "iranBold" }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      />
                      {selectedCategory.name}
                    </h2>
                  </div>

                  <span
                    className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "iranSans-r",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    نمایش {filteredCourses.length} مورد
                  </span>
                </div>

                {/* گرید ویدیوها */}
                {filteredCourses.length === 0 ? (
                  <div
                    className="text-center py-16 rounded-3xl border border-dashed"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10" style={{ color: "#94A3B8" }} />
                    </div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: "var(--color-primary)", fontFamily: "iranBold" }}
                    >
                      ویدیو یا دوره‌ای یافت نشد
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)", fontFamily: "iranSans-r" }}
                    >
                      در این دسته‌بندی هنوز محتوایی ثبت نشده است.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.map((course, idx) => (
                      <CourseCard
                        key={course._id}
                        course={course}
                        idx={idx}
                        clientTime={clientTime}
                        isHovered={hoveredCard === course._id}
                        onHoverStart={() => setHoveredCard(course._id)}
                        onHoverEnd={() => setHoveredCard(null)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* خلاصه آمار پایین صفحه */}
          {courses.length > 0 && (
            <div className="mt-12">
              <StatsSummary
                coursesCount={courses.length}
                categoriesCount={categories.length}
              />
            </div>
          )}
        </main>
      </Container>
    </div>
  );
}