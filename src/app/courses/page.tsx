"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import Container from "./../../component/Container";

// Import custom page sub-components
import CourseHero from "./../../component/courses/CourseHero";
import CategoryFilters from "./../../component/courses/CategoryFilters";
import CourseCard from "./../../component/courses/CourseCard";
import StatsSummary from "./../../component/courses/StatsSummary";

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clientTime, setClientTime] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
    setClientTime(Date.now()); // Set client time to prevent Hydration mismatch bugs
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `/api/courses?category=${selectedCategory}`
        : "/api/courses";
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        console.error("داده نامعتبر:", data);
        setCourses([]);
      }
    } catch (error) {
      console.error("خطا در دریافت دوره‌ها:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <Container>
        <main dir="rtl" className="py-8">
          
          {/* Header Section */}
          <CourseHero />

          {/* Category Filter Buttons */}
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalCoursesCount={courses.length}
          />

          {/* Courses Grid List */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
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
                      borderColor: "#2563EB",
                      borderTopColor: "transparent",
                    }}
                  ></div>
                </div>
                <p
                  className="mt-4 text-sm"
                  style={{ color: "#475569", fontFamily: "iranSans-r" }}
                >
                  در حال بارگذاری دوره‌ها...
                </p>
              </motion.div>
            ) : courses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen
                    className="w-10 h-10"
                    style={{ color: "#94A3B8" }}
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
                >
                  دوره‌ای یافت نشد
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "#475569", fontFamily: "iranSans-r" }}
                >
                  {selectedCategory
                    ? "در این گروه دوره‌ای وجود ندارد"
                    : "هنوز دوره‌ای ثبت نشده است"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {courses.map((course, idx) => (
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Summary Stats */}
          {courses.length > 0 && (
            <StatsSummary
              coursesCount={courses.length}
              categoriesCount={categories.length}
            />
          )}
        </main>
      </Container>
    </div>
  );
}