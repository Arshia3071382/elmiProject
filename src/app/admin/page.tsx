"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  MessageSquare, 
  FileText, 
  Bell, 
  Users, 
  Calendar, 
  Sparkles, 
  ShieldCheck,
  Menu,
  X,
  Star // ایمپورت آیکون ستاره برای نظرات
} from "lucide-react";

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
import AdminCommentsPanel from "@/component/adminpaneldet/AdminCommentsPanel"; // ایمپورت کامپوننت مدیریت نظرات که ساختیم

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
  
  // مدیریت تب‌ها و منوی موبایل (اضافه شدن "comments" به لیست تب‌ها)
  const [activeMainTab, setActiveMainTab] = useState<
    | "dashboard"
    | "courses"
    | "elite-league"
    | "grade-league"
    | "topics"
    | "articles"
    | "notices"
    | "teachers"
    | "calendar"
    | "showcase"
    | "permissions"
    | "comments"
  >("dashboard");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState<"courses" | "categories">("courses");
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

  const menuItems = [
    { id: "dashboard", label: "داشبورد و آمار", icon: LayoutDashboard },
    { id: "courses", label: "دوره‌ها و گروه‌ها", icon: BookOpen },
    { id: "elite-league", label: "لیگ نخبگان", icon: Award },
    { id: "grade-league", label: "لیگ مقاطع", icon: Award },
    { id: "topics", label: "مباحث چت", icon: MessageSquare },
    { id: "articles", label: "مقالات", icon: FileText },
    { id: "notices", label: "اطلاعیه‌ها", icon: Bell },
    { id: "teachers", label: "اساتید", icon: Users },
    { id: "calendar", label: "تقویم", icon: Calendar },
    { id: "showcase", label: "ویترین", icon: Sparkles },
    { id: "comments", label: "نظرات دانشجویان", icon: Star }, // اضافه شدن تب نظرات به منو
    { id: "permissions", label: "سطح دسترسی ارشد", icon: ShieldCheck },
  ];

  const activeItemTitle = menuItems.find(i => i.id === activeMainTab)?.label || "انتخاب بخش";

  return (
    <div
      dir="rtl"
      className="min-h-screen mt-6 sm:mt-24 bg-gradient-to-br from-gray-50 to-gray-100 font-sans pb-12"
    >
      {/* هدر سایت */}
      <header className="relative bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#1F3A5F] text-white shadow-xl overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 text-center md:text-right w-full md:w-auto justify-center md:justify-start">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-xl sm:text-2xl font-black text-sky-300">🎓</span>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                  پنل مدیریت علمی منتظران
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  بروزرسانی زنده
                </span>
              </div>
              <p className="text-blue-100/80 text-xs sm:text-sm font-medium">
                مدیریت یکپارچه دوره‌ها، گروه‌ها، اطلاعیه‌ها، اساتید و لیگ نخبگان
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/90 text-white border border-white/20 hover:border-red-500 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95 font-bold text-xs sm:text-sm cursor-pointer w-full md:w-auto"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </header>

      {/* بخش انتخاب بخش‌ها */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        
        {/* حالت موبایل */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm font-bold text-gray-800 text-sm cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Menu className="w-5 h-5" />
              </span>
              <span>بخش فعال: <strong className="text-blue-600">{activeItemTitle}</strong></span>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">تغییر بخش</span>
          </button>

          {isMobileMenuOpen && (
            <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 space-y-1 z-50 relative animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-1">
                <span className="text-xs font-bold text-gray-400">انتخاب بخش مدیریت</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMainTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMainTab(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-right cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* حالت دسکتاپ */}
        <div className="hidden lg:flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 items-center gap-1 overflow-x-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMainTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMainTab(item.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs xl:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* محتوای بخش انتخاب شده */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="transition-all duration-300">
          
          {activeMainTab === "dashboard" && (
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
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
                <AdminSidebar
                  courses={courses || []}
                  contactMessages={contactMessages || []}
                />
              </div>
            </div>
          )}

          {activeMainTab === "courses" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 space-y-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveCourseTab("courses")}
                  className={`px-4 sm:px-6 py-3 font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer ${activeCourseTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                  مدیریت دوره‌ها
                </button>
                <button
                  onClick={() => setActiveCourseTab("categories")}
                  className={`px-4 sm:px-6 py-3 font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer ${activeCourseTab === "categories" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                  مدیریت گروه‌ها
                </button>
              </div>

              {activeCourseTab === "courses" ? (
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
          )}

          {activeMainTab === "elite-league" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminEliteLeaguePanel onShowMessage={showMessage} />
            </div>
          )}

          {activeMainTab === "grade-league" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminGradeLeaguePanel />
            </div>
          )}

          {activeMainTab === "topics" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminTopicsPanel onShowMessage={showMessage} />
            </div>
          )}

          {activeMainTab === "articles" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminArticlesPanel onShowMessage={showMessage} />
            </div>
          )}

          {activeMainTab === "notices" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminNoticePanel onShowMessage={showMessage} />
            </div>
          )}

          {activeMainTab === "teachers" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminTeachersPanel />
            </div>
          )}

          {activeMainTab === "calendar" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminCalendarPanel onShowMessage={showMessage} />
            </div>
          )}

          {activeMainTab === "showcase" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminShowcasePanel />
            </div>
          )}

          {/* پنل مدیریت نظرات دانشجویان */}
          {activeMainTab === "comments" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <AdminCommentsPanel />
            </div>
          )}

          {activeMainTab === "permissions" && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto">
              <SeniorPermissionManager onShowMessage={showMessage} />
            </div>
          )}

        </div>
      </main>

      {/* پیام‌رسان (Toast) */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl shadow-lg z-50 text-white font-bold text-xs sm:text-sm ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {message.text}
        </div>
      )}

      {/* مودال افزودن گروه */}
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