"use client";

import { useState, useEffect } from "react";
import Container from "./../../component/Container";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  category: Category;
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
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
      console.error("خطا:", error);
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
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <main dir="rtl" className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-extrabold text-center mb-6 font-iranBold">
          دوره‌های آموزشی
        </h1>

        {/* فیلتر گروه‌ها */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full transition ${
                !selectedCategory
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              همه دوره‌ها
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === cat._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* نمایش دوره‌ها */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">هیچ دوره‌ای در این گروه یافت نشد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {course.category?.name || "بدون گروه"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    ثبت شده در: {new Date(course.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Container>
  );
}