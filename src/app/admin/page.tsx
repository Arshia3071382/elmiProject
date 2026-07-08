"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Clock,
  BookOpen,
  LogOut,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
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
interface ContactMessage {
  _id: string;
  name: string;
  subject: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();

  // استیت‌های اصلی پنل
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "categories">(
    "courses",
  );

  // استیت‌های مربوط به احراز هویت
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [inputPassword, setInputPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // نمایش پیام‌های سیستم
  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // توابع واکشی داده‌ها مجهز به useCallback برای جلوگیری از ارور هوک
  const fetchCategories = useCallback(async () => {
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
      showMessage("error", "خطا در دریافت گروه‌ها");
    }
  }, [selectedCategory, showMessage]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (error) {
      showMessage("error", "خطا در دریافت دوره‌ها");
    }
  }, [showMessage]);

  const fetchContactMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      if (data.success) setContactMessages(data.messages);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ۱. بررسی وضعیت لاگین به محض ورود به صفحه (اگر کوکی معتبر باشد، بدون رمز وارد می‌شود)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/check-auth");
        const data = await res.json();

        if (data && data.isLoggedIn) {
          setIsLoggedIn(true);
          fetchCategories();
          fetchCourses();
          fetchContactMessages();
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("خطا در بررسی احراز هویت:", error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [fetchCategories, fetchCourses, fetchContactMessages]);

  // ۲. مدیریت فرم سابمیت رمز عبور مودال
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: inputPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(true);
        // به جای صدا زدن دستی توابع، بگذارید صفحه یک‌بار وضعیت جدید را از سرور بخواند
        window.location.reload();
      } else {
        setLoginError(data.error || "رمز عبور وارد شده اشتباه است");
      }
    } catch (err) {
      setLoginError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showMessage("error", "لطفاً نام گروه را وارد کنید");
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
        showMessage("success", `گروه "${newCategoryName}" با موفقیت اضافه شد`);
        setCategories((prev) => [data.category, ...prev]);
        setSelectedCategory(data.category._id);
        setShowCategoryModal(false);
        setNewCategoryName("");
      }
    } catch (error) {
      showMessage("error", "خطا در ارتباط با سرور");
    }
  };

  const handleAddCourse = async (formData: FormData) => {
    if (!selectedCategory) {
      showMessage("error", "لطفاً یک گروه انتخاب کنید");
      return false;
    }
    formData.set("categoryId", selectedCategory);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", `دوره با موفقیت اضافه شد`);
        fetchCourses();
        return true;
      }
      return false;
    } catch (error) {
      showMessage("error", "خطا در ارتباط با سرور");
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin-logout", { method: "POST" });
      setIsLoggedIn(false);
      setInputPassword("");
    } catch (error) {
      showMessage("error", "خطا در خروج از پنل");
    }
  };

  const getCategoryCourseCount = (categoryId: string) =>
    courses.filter((course) => course.category?._id === categoryId).length;
  const recentCourses = [...courses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);
  const averageCourses =
    categories.length > 0 ? (courses.length / categories.length).toFixed(1) : 0;

  // وضعیت اول: در حال چک کردن وضعیت لاگین کوکی‌ها (صفحه سفید بدون پرش)
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-white"></div>;
  }

  // وضعیت دوم: کاربر لاگین نیست -> نمایش مودال شیک ورود در صفحه کاملاً سفید
  if (!isLoggedIn) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-white flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-8 space-y-6 transition duration-300">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">
              ورود به پنل مدیریت
            </h2>
            <p className="text-xs text-gray-400">
              برای دسترسی به تنظیمات سایت، رمز عبور را وارد کنید
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="رمز عبور ادمین"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50/50"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-50 text-sm"
            >
              {loginLoading ? "در حال تایید..." : "ورود به مدیریت"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // وضعیت سوم: لاگین تایید شده است -> نمایش کل پنل مدیریت
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-12 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black mb-2">پنل مدیریت دوره‌ها</h1>
              <p className="text-blue-100">
                مدیریت مستقیم گروه‌ها و دوره‌های آموزشی علمی منتظران
              </p>
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
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all relative text-base ${
                  activeTab === "courses"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                مدیریت دوره‌ها
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all relative text-base ${
                  activeTab === "categories"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                مدیریت گروه‌ها
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            {activeTab === "courses" ? (
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
              <h3 className="text-lg font-bold text-gray-800">
                ۱۰ دوره اخیر ثبت شده
              </h3>
            </div>

            {recentCourses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                هنوز دوره‌ای ثبت نشده است.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {recentCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {course.name}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {course.category?.name || "بدون گروه"}
                        </span>
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

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Mail className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">
                ۱۰ پیام اخیر کاربران
              </h3>
            </div>

            {contactMessages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                پیامی دریافت نشده است.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {contactMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-gray-800">
                      موضوع: {msg.subject}
                    </h4>
                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-50 leading-relaxed break-words">
                      {msg.message}
                    </p>
                    <div
                      className="text-[11px] text-gray-500 text-left font-mono"
                      dir="ltr"
                    >
                      📞 {msg.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg z-50 ${
            message.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
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
                <label className="block text-gray-700 font-medium mb-2">
                  نام گروه
                </label>
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
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition"
                >
                  ایجاد گروه
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition"
                >
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
