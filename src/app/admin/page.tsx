"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, FolderPlus, Clock, BookOpen, LogOut } from "lucide-react";
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
  videoUrl?: string;
  description?: string;
  duration?: string;
}

export default function AdminPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<'courses' | 'categories'>('courses');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        
        if (data && data.isLoggedIn) {
          setIsCheckingAuth(false);
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.error("خطا در بررسی احراز هویت:", error);
        router.replace('/');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchCategories();
      fetchCourses();
    }
  }, [isCheckingAuth]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.categories[0]._id);
        }
      } else {
        console.error("خطا در دریافت گروه‌ها:", data.error);
      }
    } catch (error) {
      console.error("خطا در دریافت گروه‌ها:", error);
      showMessage('error', 'خطا در دریافت گروه‌ها');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      } else {
        console.error("خطا در دریافت دوره‌ها:", data.error);
      }
    } catch (error) {
      console.error("خطا در دریافت دوره‌ها:", error);
      showMessage('error', 'خطا در دریافت دوره‌ها');
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
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();
      if (data.success && data.category) {
        showMessage('success', `گروه "${newCategoryName}" با موفقیت اضافه شد`);
        
        // ۱. اضافه کردن مستقیم گروه جدیدِ ساخته شده به ابتدای آرایه استیت کلاینت
        setCategories((prev) => [data.category, ...prev]);
        
        // ۲. قرار دادنِ منوی انتخاب گروه (دراپ‌داون) روی گروهی که همین الان ساخته شد!
        setSelectedCategory(data.category._id);
        
        setShowCategoryModal(false);
        setNewCategoryName("");
      } else {
        showMessage('error', data.error || "خطا در ایجاد گروه");
      }
    } catch (error) {
      console.error("خطا:", error);
      showMessage('error', "خطا در ارتباط با سرور");
    }
  };

  const handleAddCourse = async (formData: FormData) => {
    if (!selectedCategory) {
      showMessage('error', 'لطفاً یک گروه انتخاب کنید');
      return false;
    }

    // 🔴 باگ اصلی اینجا حل می‌شود: اضافه کردن شناسه گروه به اطلاعات ارسالی فرم
    formData.set("categoryId", selectedCategory);

    // دیباگ سریع در کنسول مرورگر برای اطمینان از صحت فایل ویدیو
    console.log("فایل ویدیوی ارسالی:", formData.get("video"));
    console.log("شناسه گروه ارسالی:", formData.get("categoryId"));

    try {
      const res = await fetch("/api/courses", {
        // در متدهای دارای FormData، هدر Content-Type نباید دستی ست شود (Next.js خودش مدیریت می‌کند)
        method: "POST", 
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', `دوره با موفقیت اضافه شد`);
        fetchCourses();
        return true;
      } else {
        showMessage('error', data.error || "خطا در ثبت دوره");
        return false;
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
      showMessage('error', "خطا در ارتباط با سرور");
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'POST' });
      router.replace('/');
    } catch (error) {
      console.error('خطا در خروج:', error);
      showMessage('error', 'خطا در خروج از پنل');
    }
  };

  const getCategoryCourseCount = (categoryId: string) => {
    return courses.filter(course => course.category?._id === categoryId).length;
  };

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const averageCourses = categories.length > 0 
    ? (courses.length / categories.length).toFixed(1) 
    : 0;

  if (isCheckingAuth) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-12 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black mb-2">پنل مدیریت دوره‌ها</h1>
              <p className="text-blue-100">مدیریت مستقیم گروه‌ها و دوره‌های آموزشی علمی منتظران</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              خروج از پنل
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all relative text-base ${
                  activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                مدیریت دوره‌ها
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all relative text-base ${
                  activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                مدیریت گروه‌ها
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
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
        </div>

        <div className="space-y-6">
          <StatsCards
            categoriesCount={categories.length}
            coursesCount={courses.length}
            averageCourses={Number(averageCourses)}
          />

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">۱۰ دوره اخیر ثبت شده</h3>
            </div>
            
            {recentCourses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">هنوز دوره‌ای ثبت نشده است.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {recentCourses.map((course) => (
                  <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{course.name}</h4>
                        <span className="text-xs text-gray-400">{course.category?.name || "بدون گروه"}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                      {new Date(course.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg z-50 ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

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