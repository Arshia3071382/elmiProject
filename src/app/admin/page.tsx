// Admin page - Main component
"use client";

import { useState, useEffect, useCallback } from "react";
import StatsCards from "@/component/adminpaneldet/StatsCards";
import AddCourseForm from "@/component/adminpaneldet/AddCourseForm";
import CourseManager from "@/component/adminpaneldet/CourseManager";
import CategoryManager from "@/component/adminpaneldet/CategoryManager";
import AdminSidebar from "@/component/adminpaneldet/AdminSidebar";
import AdminLoginModal from "@/component/adminpaneldet/AdminLoginModal";
import AddCategoryModal from "@/component/adminpaneldet/AddCategoryModal";
import AdminEliteLeaguePanel from "@/component/adminpaneldet/AdminEliteLeaguePanel";
import AdminTopicsPanel from "@/component/adminpaneldet/AdminTopicsPanel";
import AdminArticlesPanel from "@/component/adminpaneldet/AdminArticlesPanel";
import AdminCalendarPanel from "@/component/adminpaneldet/AdminCalendarPanel";
import AdminShowcasePanel from "@/component/adminpaneldet/AdminShowcasePanel";
import AdminGradeLeaguePanel from "@/component/adminpaneldet/AdminGradeLeaguePanel";
import SeniorPermissionManager from "@/component/adminpaneldet/SeniorPermissionManager";
import AdminNoticePanel from "@/component/adminpaneldet/AdminNoticePanel";
import AdminTeachersPanel from "@/component/adminpaneldet/AdminTeachersPanel";
import AdminCommentsPanel from "@/component/adminpaneldet/AdminCommentsPanel";
import AdminPodcastPanel from "@/component/adminpaneldet/AdminPodcastPanel";
import AdminExamsPanel from "@/component/adminpaneldet/AdminExamsPanel";
import AdminToast from "./AdminToast";
import { MainTab, CourseTab } from "./constants";

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [activeCourseTab, setActiveCourseTab] = useState<CourseTab>("courses");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (res?.success && Array.isArray(res.categories)) {
        setCategories(res.categories);
        if (res.categories.length > 0 && !selectedCategory) setSelectedCategory(res.categories[0]._id);
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
      const res = await fetch("/api/courses", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      setCourses(res?.success && Array.isArray(res.courses) ? res.courses : []);
    } catch (err) {
      console.error(err);
      showMessage("error", "خطا در دریافت دوره‌ها");
    }
  }, [showMessage]);

  const fetchContactMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/contacts", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (res?.success && Array.isArray(res.messages)) setContactMessages(res.messages);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch("/api/check-auth", { cache: "no-store" });
      const data = await res.json();
      if (data.isLoggedIn === true) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        await Promise.all([fetchCategories(), fetchCourses(), fetchContactMessages()]);
      } else {
        setIsLoggedIn(false);
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
      setShowLoginModal(true);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [fetchCategories, fetchCourses, fetchContactMessages]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return showMessage("error", "لطفاً نام گروه را وارد کنید");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      }).then((r) => r.json()).catch(() => null);

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
      const res = await fetch("/api/courses", { method: "POST", body: formData }).then((r) => r.json()).catch(() => null);
      if (res?.success) {
        showMessage("success", "دوره با موفقیت اضافه شد");
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
        setShowLoginModal(true);
      } else {
        showMessage("error", "خطا در خروج از پنل");
      }
    } catch {
      showMessage("error", "خطا در ارتباط با سرور");
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsLoggedIn(true);
    window.location.reload();
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-500">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return <AdminLoginModal onLoginSuccess={handleLoginSuccess} />;

  const panelComponents: Record<MainTab, React.ReactNode> = {
    dashboard: (
      <div className="space-y-6">
        <StatsCards categoriesCount={categories.length} coursesCount={courses.length} averageCourses={categories.length ? Number((courses.length / categories.length).toFixed(1)) : 0} />
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
          <AdminSidebar courses={courses} contactMessages={contactMessages} />
        </div>
      </div>
    ),
    courses: (
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 space-y-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setActiveCourseTab("courses")} className={`px-4 sm:px-6 py-3 font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer ${activeCourseTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>
            مدیریت دوره‌ها
          </button>
          <button onClick={() => setActiveCourseTab("categories")} className={`px-4 sm:px-6 py-3 font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer ${activeCourseTab === "categories" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>
            مدیریت گروه‌ها
          </button>
        </div>
        {activeCourseTab === "courses" ? (
          <>
            <AddCourseForm categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} onAddCourse={handleAddCourse} coursesCount={(id) => courses.filter((c) => c?.category?._id === id).length} />
            <CourseManager courses={courses} categories={categories} onCourseUpdate={fetchCourses} onShowMessage={showMessage} />
          </>
        ) : (
          <CategoryManager categories={categories} coursesCount={(id) => courses.filter((c) => c?.category?._id === id).length} onCategoryUpdate={() => { fetchCategories(); fetchCourses(); }} onShowMessage={showMessage} onOpenAddModal={() => setShowCategoryModal(true)} />
        )}
      </div>
    ),
    "elite-league": <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminEliteLeaguePanel onShowMessage={showMessage} /></div>,
    "grade-league": <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminGradeLeaguePanel /></div>,
    topics: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminTopicsPanel onShowMessage={showMessage} /></div>,
    articles: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminArticlesPanel onShowMessage={showMessage} /></div>,
    notices: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminNoticePanel onShowMessage={showMessage} /></div>,
    teachers: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminTeachersPanel /></div>,
    calendar: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminCalendarPanel onShowMessage={showMessage} /></div>,
    showcase: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminShowcasePanel /></div>,
    comments: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminCommentsPanel /></div>,
    podcasts: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminPodcastPanel /></div>,
    exams: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminExamsPanel /></div>,
    permissions: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><SeniorPermissionManager onShowMessage={showMessage} /></div>,
  };

  const menuItems: { id: MainTab; label: string }[] = [
    { id: "dashboard", label: "داشبورد" },
    { id: "courses", label: "دوره‌ها" },
    { id: "elite-league", label: "لیگ نخبگان" },
    { id: "grade-league", label: "لیگ مقاطع" },
    { id: "topics", label: "مباحث چت" },
    { id: "articles", label: "مقالات" },
    { id: "notices", label: "اطلاعیه‌ها" },
    { id: "teachers", label: "اساتید" },
    { id: "calendar", label: "تقویم" },
    { id: "showcase", label: "ویترین" },
    { id: "comments", label: "نظرات" },
    { id: "podcasts", label: "پادکست‌ها" },
    { id: "exams", label: "آزمون‌ها" },
    { id: "permissions", label: "دسترسی‌ها" },
  ];

  return (
    <div dir="rtl" className="min-h-screen mt-6 sm:mt-24 bg-gradient-to-br from-gray-50 to-gray-100 font-sans pb-12">
      <header className="relative bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#1F3A5F] text-white shadow-xl overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 text-center md:text-right w-full md:w-auto justify-center md:justify-start">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-xl sm:text-2xl font-black text-sky-300">🎓</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">پنل مدیریت</h1>
              <p className="text-blue-100/80 text-xs sm:text-sm font-medium">مدیریت یکپارچه دوره‌ها، گروه‌ها، اطلاعیه‌ها و آزمون‌ها</p>
            </div>
          </div>
          <button onClick={handleLogout} className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/95 text-white border border-white/20 hover:border-red-500 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95 font-bold text-xs sm:text-sm cursor-pointer w-full md:w-auto">
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* اسلایدر افقی همراه با اسکرول‌بار زیرین */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="transition-all duration-300">{panelComponents[activeTab]}</div>
      </main>

      <AdminToast message={message} />
      <AddCategoryModal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} onSubmit={handleAddCategory} name={newCategoryName} onNameChange={setNewCategoryName} />
    </div>
  );
}