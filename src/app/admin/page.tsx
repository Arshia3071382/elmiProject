"use client";

import { useState, useEffect, useCallback } from "react";
import { LogOut } from "lucide-react";
import StatsCards from "./../../component/adminpaneldet/StatsCards";
import AddCourseForm from "./../../component/adminpaneldet/AddCourseForm";
import CourseManager from "./../../component/adminpaneldet/CourseManager";
import CategoryManager from "./../../component/adminpaneldet/CategoryManager";
import AdminSidebar from "./../../component/adminpaneldet/AdminSidebar";
import AdminLoginModal from "./../../component/adminpaneldet/AdminLoginModal";
import AddCategoryModal from "./../../component/adminpaneldet/AddCategoryModal";
import AdminEliteLeaguePanel from "./../../component/adminpaneldet/AdminEliteLeaguePanel";
import AdminTopicsPanel from "./../../component/adminpaneldet/AdminTopicsPanel";
import AdminArticlesPanel from "./../../component/adminpaneldet/AdminArticlesPanel";
import AdminCalendarPanel from "@/component/adminpaneldet/AdminCalendarPanel";
import AdminShowcasePanel from "@/component/adminpaneldet/AdminShowcasePanel";
import AdminGradeLeaguePanel from "@/component/adminpaneldet/AdminGradeLeaguePanel";
import SeniorPermissionManager from "@/component/adminpaneldet/SeniorPermissionManager";
import AdminNoticePanel from "@/component/adminpaneldet/AdminNoticePanel";
import AdminTeachersPanel from "@/component/adminpaneldet/AdminTeachersPanel";

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [chatTopics, setChatTopics] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "categories">(
    "courses"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.categories)) {
        setCategories(res.categories);
        if (res.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(res.categories[0]._id);
        }
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "خطا در دریافت گروه‌ها");
    }
  }, [selectedCategory, showMessage]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.courses)) {
        setCourses(res.courses);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "خطا در دریافت دوره‌ها");
    }
  }, [showMessage]);

  const fetchContactMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/contacts", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.messages)) {
        setContactMessages(res.messages);
      } else {
        setContactMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchChatTopics = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/topics", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.data)) {
        setChatTopics(res.data);
      } else {
        setChatTopics([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/check-auth", { cache: "no-store" });
      const data = await res.json();

      if (data.isLoggedIn === true) {
        setIsLoggedIn(true);
        await Promise.all([
          fetchCategories(),
          fetchCourses(),
          fetchContactMessages(),
          fetchChatTopics(),
        ]);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [fetchCategories, fetchCourses, fetchContactMessages, fetchChatTopics]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim())
      return showMessage("error", "لطفاً نام گروه را وارد کنید");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })
        .then((r) => r.json())
        .catch(() => null);

      if (res?.success && res.category) {
        showMessage("success", `گروه "${newCategoryName}" با موفقیت اضافه شد`);
        setCategories((prev) => [res.category, ...prev]);
        setSelectedCategory(res.category._id);
        setShowCategoryModal(false);
        setNewCategoryName("");
      } else {
        showMessage("error", res?.error || "خطا در ثبت گروه");
      }
    } catch {
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
      })
        .then((r) => r.json())
        .catch(() => null);

      if (res?.success) {
        showMessage("success", `دوره با موفقیت اضافه شد`);
        fetchCourses();
        return true;
      }
    } catch {
      showMessage("error", "خطا در ارتباط با سرور");
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin-logout", { method: "POST" });
      if (res.ok) {
        setIsLoggedIn(false);
        window.location.href = "/";
      } else {
        showMessage("error", "خطا در خروج از پنل");
      }
    } catch {
      showMessage("error", "خطا در ارتباط با سرور");
    }
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-white"></div>;

  if (!isLoggedIn)
    return <AdminLoginModal onLoginSuccess={() => window.location.reload()} />;

  return (
    <div
      dir="rtl"
      className="min-h-screen mt-10 sm:mt-30 bg-gradient-to-br from-gray-50 to-gray-100 font-sans"
    >
      <header className="relative bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#1F3A5F] text-white shadow-xl overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-2xl font-black text-sky-300">🎓</span>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  پنل مدیریت علمی منتظران
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  بروزرسانی زنده
                </span>
              </div>
              <p className="text-blue-100/80 text-sm font-medium">
                مدیریت یکپارچه دوره‌ها، گروه‌ها، اطلاعیه‌ها، اساتید و لیگ نخبگان
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2.5 bg-white/10 hover:bg-red-500/90 text-white border border-white/20 hover:border-red-500 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95 font-bold text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <SeniorPermissionManager onShowMessage={showMessage} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-6 py-4 font-bold text-base ${activeTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            >
              مدیریت دوره‌ها
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-4 font-bold text-base ${activeTab === "categories" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            >
              مدیریت گروه‌ها
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            {activeTab === "courses" ? (
              <>
                <AddCourseForm
                  categories={categories || []}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  onAddCourse={handleAddCourse}
                  coursesCount={(id) =>
                    (courses || []).filter((c) => c?.category?._id === id)
                      .length
                  }
                />
                <CourseManager
                  courses={courses || []}
                  categories={categories || []}
                  onCourseUpdate={fetchCourses}
                  onShowMessage={showMessage}
                />
              </>
            ) : (
              <CategoryManager
                categories={categories || []}
                coursesCount={(id) =>
                  (courses || []).filter((c) => c?.category?._id === id).length
                }
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
            categoriesCount={(categories || []).length}
            coursesCount={(courses || []).length}
            averageCourses={
              (categories || []).length
                ? Number(
                    (
                      (courses || []).length / (categories || []).length
                    ).toFixed(1),
                  )
                : 0
            }
          />
          <AdminSidebar
            courses={courses || []}
            contactMessages={contactMessages || []}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminEliteLeaguePanel onShowMessage={showMessage} />
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminGradeLeaguePanel />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminTopicsPanel onShowMessage={showMessage} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminArticlesPanel onShowMessage={showMessage} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminNoticePanel onShowMessage={showMessage} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminTeachersPanel/>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminCalendarPanel onShowMessage={showMessage} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AdminShowcasePanel />
      </div>

      {message && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg z-50 text-white font-bold text-sm ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {message.text}
        </div>
      )}
      <AddCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleAddCategory}
        name={newCategoryName}
        onNameChange={setNewCategoryName}
      />
    </div>
  );
}