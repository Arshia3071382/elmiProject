"use client";

import { useState, useEffect, useCallback } from "react";
import StatsCards from "@/component/adminpaneldet/StatsCards";
import AddCourseForm from "@/component/adminpaneldet/AddCourseForm";
import CourseManager from "@/component/adminpaneldet/CourseManager";
import CategoryManager from "@/component/adminpaneldet/CategoryManager";
import AdminSidebar from "@/component/adminpaneldet/AdminSidebar";
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
import AdminBorhanPanel from "@/component/adminpaneldet/AdminBorhanPanel";
import AdminStoriesPanel from "@/component/adminpaneldet/AdminStoriesPanel";
import AdminLivePanel from "@/component/adminpaneldet/AdminLivePanel";
import AdminStudentsList from "@/component/adminpaneldet/AdminStudentsList";
import AdminSeoPanel from "@/component/adminpaneldet/AdminSeoPanel";

import AdminToast from "./AdminToast";
import { CourseTab } from "./constants";
import { LogOut, Settings } from "lucide-react";

import AdminLoadingScreen from "@/component/adminpaneldet/AdminLoadingScreen";
import AdminSecurityModal from "@/component/adminpaneldet/AdminSecurityModal";
import AdminCredentialsModal from "@/component/adminpaneldet/AdminCredentialsModal";
import { useAdminAuth } from "@/component/adminpaneldet/useAdminAuth";

export default function AdminPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  // Credentials modal
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [activeCredentialSubTab, setActiveCredentialSubTab] = useState<"credentials" | "securityPin">("credentials");
  const [credentialForm, setCredentialForm] = useState({ oldUsername: "", oldPassword: "", newUsername: "", newPassword: "" });
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [credentialMessage, setCredentialMessage] = useState({ text: "", type: "" });
  const [pinForm, setPinForm] = useState({ oldPin: "", newPin: "", confirmPin: "" });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState({ text: "", type: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Security modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const sensitiveTabs = ["students", "elite-league", "grade-league", "notices", "exams", "permissions", "seo"];

  const [adminStats, setAdminStats] = useState({
    categoriesCount: 0,
    coursesCount: 0,
    averageCourses: 0,
    elementaryGrades: [] as { grade: number; count: number }[],
    middleGrades: [] as { grade: number; count: number }[],
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeCourseTab, setActiveCourseTab] = useState<CourseTab>("courses");

  // ✅ handleLogout قبل از useAdminAuth تعریف می‌شود
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin-logout", { method: "POST" });
    } catch {}
    window.location.href = "/";
  }, []);

  // Auth (idle timer + verify) — حالا می‌تواند به handleLogout دسترسی داشته باشد
  useAdminAuth(isChecking, setIsChecking, handleLogout);

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
    } catch (err) { console.error(err); }
  }, []);

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (res?.success && res.stats) setAdminStats(res.stats);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (!isChecking) {
      Promise.all([fetchCategories(), fetchCourses(), fetchContactMessages(), fetchAdminStats()]);
    }
  }, [isChecking, fetchCategories, fetchCourses, fetchContactMessages, fetchAdminStats]);

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
        fetchAdminStats();
      } else {
        showMessage("error", res?.error || "خطا در ثبت گروه");
      }
    } catch {
      showMessage("error", "خطا در ارتباط با سرور");
    }
  };

  const handleAddCourse = async (formData: FormData) => {
    if (!selectedCategory) { showMessage("error", "لطفاً یک گروه انتخاب کنید"); return false; }
    formData.set("categoryId", selectedCategory);
    try {
      const res = await fetch("/api/courses", { method: "POST", body: formData }).then((r) => r.json()).catch(() => null);
      if (res?.success) {
        showMessage("success", "دوره با موفقیت اضافه شد");
        fetchCourses();
        fetchAdminStats();
        return true;
      }
    } catch {
      showMessage("error", "خطا در ارتباط با سرور");
    }
    return false;
  };

  const handleTabClick = (tabId: string) => {
    if (sensitiveTabs.includes(tabId)) {
      setPendingTab(tabId);
      setIsSecurityModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleSecuritySuccess = () => {
    setIsSecurityModalOpen(false);
    if (pendingTab) setActiveTab(pendingTab);
    setPendingTab(null);
  };

  const handleSecurityClose = () => {
    setIsSecurityModalOpen(false);
    setPendingTab(null);
  };

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentialForm({ ...credentialForm, [e.target.name]: e.target.value });
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialLoading(true);
    setCredentialMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCredentialMessage({ text: data.message, type: "success" });
        setCredentialForm({ oldUsername: "", oldPassword: "", newUsername: "", newPassword: "" });
        setTimeout(() => {
          setIsCredentialModalOpen(false);
          setCredentialMessage({ text: "", type: "" });
        }, 2000);
      } else {
        setCredentialMessage({ text: data.message || "خطایی رخ داد.", type: "error" });
      }
    } catch {
      setCredentialMessage({ text: "خطا در ارتباط با سرور.", type: "error" });
    } finally {
      setCredentialLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinForm({ ...pinForm, [e.target.name]: e.target.value });
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinLoading(true);
    setPinMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/admin/security-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pinForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPinMessage({ text: data.message, type: "success" });
        setPinForm({ oldPin: "", newPin: "", confirmPin: "" });
        setTimeout(() => {
          setIsCredentialModalOpen(false);
          setPinMessage({ text: "", type: "" });
        }, 2000);
      } else {
        setPinMessage({ text: data.message || "خطایی رخ داد.", type: "error" });
      }
    } catch {
      setPinMessage({ text: "خطا در ارتباط با سرور.", type: "error" });
    } finally {
      setPinLoading(false);
    }
  };

  if (isChecking) return <AdminLoadingScreen />;

  const panelComponents: Record<string, React.ReactNode> = {
    dashboard: (
      <div className="space-y-6">
        <StatsCards
          categoriesCount={adminStats.categoriesCount}
          coursesCount={adminStats.coursesCount}
          averageCourses={adminStats.averageCourses}
          elementaryGrades={adminStats.elementaryGrades}
          middleGrades={adminStats.middleGrades}
        />
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
            <CourseManager courses={categories.length ? courses : []} categories={categories} onCourseUpdate={fetchCourses} onShowMessage={showMessage} />
          </>
        ) : (
          <CategoryManager categories={categories} coursesCount={(id) => courses.filter((c) => c?.category?._id === id).length} onCategoryUpdate={() => { fetchCategories(); fetchCourses(); }} onShowMessage={showMessage} onOpenAddModal={() => setShowCategoryModal(true)} />
        )}
      </div>
    ),
    students: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminStudentsList onShowMessage={showMessage} /></div>,
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
    borhan: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminBorhanPanel onShowMessage={showMessage} /></div>,
    stories: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminStoriesPanel /></div>,
    live: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminLivePanel /></div>,
    seo: <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 overflow-x-auto"><AdminSeoPanel onShowMessage={showMessage} /></div>,
  };

  const menuItems: { id: string; label: string }[] = [
    { id: "dashboard", label: "داشبورد" },
    { id: "courses", label: "دوره‌ها" },
    { id: "students", label: "دانش‌آموزان" },
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
    { id: "borhan", label: "پروژه برهان" },
    { id: "stories", label: "استوری‌ها" },
    { id: "live", label: "پخش زنده" },
    { id: "seo", label: "سئو" },
  ];

  return (
    <div dir="rtl" className="min-h-screen mt-6 sm:mt-24 bg-gradient-to-br from-gray-50 to-gray-100 font-sans pb-12">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#1F3A5F] text-white shadow-xl overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 text-center md:text-right w-full md:w-auto justify-center md:justify-start">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-xl sm:text-2xl font-black text-sky-300">🎓</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">پنل مدیریت</h1>
              <p className="text-blue-100/80 text-xs sm:text-sm font-medium">مدیریت یکپارچه دوره‌ها، گروه‌ها، اطلاعیه‌ها و آزمون‌ها</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <button
              onClick={() => { setIsCredentialModalOpen(true); setActiveCredentialSubTab("credentials"); }}
              className="group flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg active:scale-95 font-bold text-xs sm:text-sm cursor-pointer"
            >
              <Settings className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>تنظیمات حساب و امنیت</span>
            </button>

            <button onClick={handleLogout} className="group flex items-center justify-center gap-2 bg-white/15 hover:bg-red-500/95 text-white border border-white/20 hover:border-red-500 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95 font-bold text-xs sm:text-sm cursor-pointer">
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Security modal */}
      <AdminSecurityModal
        isOpen={isSecurityModalOpen}
        onSuccess={handleSecuritySuccess}
        onClose={handleSecurityClose}
      />

      {/* Credentials modal */}
      <AdminCredentialsModal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        activeSubTab={activeCredentialSubTab}
        onSubTabChange={setActiveCredentialSubTab}
        credentialForm={credentialForm}
        credentialLoading={credentialLoading}
        credentialMessage={credentialMessage}
        showOldPassword={showOldPassword}
        showNewPassword={showNewPassword}
        onToggleOldPassword={() => setShowOldPassword(!showOldPassword)}
        onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
        onCredentialChange={handleCredentialChange}
        onCredentialSubmit={handleCredentialSubmit}
        pinForm={pinForm}
        pinLoading={pinLoading}
        pinMessage={pinMessage}
        showOldPin={showOldPin}
        showNewPin={showNewPin}
        showConfirmPin={showConfirmPin}
        onToggleOldPin={() => setShowOldPin(!showOldPin)}
        onToggleNewPin={() => setShowNewPin(!showNewPin)}
        onToggleConfirmPin={() => setShowConfirmPin(!showConfirmPin)}
        onPinChange={handlePinChange}
        onPinSubmit={handlePinSubmit}
      />

      {/* Tabs menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
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