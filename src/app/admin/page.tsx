"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, FolderPlus } from "lucide-react";
import StatsCards from "./../../component/adminpaneldet/StatsCards";
import AddCourseForm from "./../../component/adminpaneldet/AddCourseForm";
import CourseManager from "./../../component/adminpaneldet/CourseManager";
import CategoryManager from "./../../component/adminpaneldet/CategoryManager";

interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

interface Course {
  _id: string;
  name: string;
  category: Category;
  createdAt: string;
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<'courses' | 'categories'>('courses');

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.categories[0]._id);
        }
      }
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showMessage('error', 'لطفاً نام گروه را وارد کنید');
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', `گروه "${newCategoryName}" با موفقیت اضافه شد`);
        setShowCategoryModal(false);
        setNewCategoryName("");
        fetchCategories();
      } else {
        showMessage('error', data.error || "خطا در ایجاد گروه");
      }
    } catch (error) {
      showMessage('error', "خطا در ارتباط با سرور");
    }
  };

  const handleAddCourse = async (courseName: string) => {
    if (!selectedCategory) {
      showMessage('error', 'لطفاً یک گروه انتخاب کنید');
      return;
    }

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: courseName,
          categoryId: selectedCategory 
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        showMessage('success', `دوره "${courseName}" با موفقیت اضافه شد`);
        fetchCourses();
      } else {
        showMessage('error', data.error || "خطا در ثبت دوره");
      }
    } catch (error) {
      showMessage('error', "خطا در ارتباط با سرور");
    }
  };

  const getCategoryCourseCount = (categoryId: string) => {
    return courses.filter(course => course.category?._id === categoryId).length;
  };

  const averageCourses = categories.length > 0 
    ? (courses.length / categories.length).toFixed(1) 
    : 0;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
          <h1 className="text-3xl font-bold mb-2">پنل مدیریت دوره‌ها</h1>
          <p className="text-blue-100">مدیریت گروه‌ها و دوره‌های آموزشی</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <StatsCards
          categoriesCount={categories.length}
          coursesCount={courses.length}
          averageCourses={Number(averageCourses)}
        />

        
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                activeTab === 'courses'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              مدیریت دوره‌ها
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                activeTab === 'categories'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              مدیریت گروه‌ها
            </button>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {activeTab === 'courses' ? (
            <>
              <AddCourseForm
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onAddCourse={handleAddCourse}
                coursesCount={getCategoryCourseCount}
              />
              <CourseManager
                courses={courses}
                categories={categories}
                onCourseUpdate={fetchCourses}
                onShowMessage={showMessage}
              />
            </>
          ) : (
            <CategoryManager
              categories={categories}
              coursesCount={getCategoryCourseCount}
              onCategoryUpdate={() => {
                fetchCategories();
                fetchCourses();
              }}
              onShowMessage={showMessage}
              onOpenAddModal={() => setShowCategoryModal(true)}
            />
          )}
        </div>

        {/* پیغام */}
        {message && (
          <div className={`fixed bottom-6 right-6 left-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg z-50 ${
            message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* مودال ساخت گروه */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-xl">
                <FolderPlus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">گروه جدید</h3>
            </div>
            
            <form onSubmit={handleAddCategory}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">نام گروه</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="مثال: آموزش پایتون"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition">
                  ایجاد گروه
                </button>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}