"use client";

import { useState } from "react";
import { Plus, CheckCircle } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface AddCourseFormProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCourse: (name: string) => Promise<void>;
  coursesCount: (categoryId: string) => number;
}

export default function AddCourseForm({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCourse,
  coursesCount,
}: AddCourseFormProps) {
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    
    setLoading(true);
    await onAddCourse(courseName);
    setCourseName("");
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">افزودن دوره جدید</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-8 pb-8 border-b border-gray-200">
        <div>
          <label className="block text-gray-700 font-medium mb-2">گروه دوره</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => onCategoryChange(cat._id)}
                className={`p-4 rounded-xl text-right transition-all ${
                  selectedCategory === cat._id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cat.name}</span>
                  {selectedCategory === cat._id && <CheckCircle className="w-5 h-5" />}
                </div>
                <p className={`text-sm mt-2 ${selectedCategory === cat._id ? 'text-blue-100' : 'text-gray-400'}`}>
                  {coursesCount(cat._id)} دوره
                </p>
              </button>
            ))}
          </div>
          {categories.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">هیچ گروهی وجود ندارد</p>
              <p className="text-sm text-gray-400 mt-1">ابتدا در تب مدیریت گروه‌ها، یک گروه بسازید</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">نام دوره</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: دوره مقدماتی پایتون"
          />
        </div>

        <button
          type="submit"
          disabled={loading || categories.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "در حال ثبت..." : <><Plus className="w-5 h-5" /> افزودن دوره جدید</>}
        </button>
      </form>
    </div>
  );
}