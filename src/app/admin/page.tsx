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
import { LogOut, Settings, X, Eye, EyeOff, ShieldCheck, Lock, ShieldAlert, KeyRound, UserCog } from "lucide-react";

export default function AdminPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  
  // استیت‌های مودال تنظیمات حساب و تب‌های داخلی آن
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [activeCredentialSubTab, setActiveCredentialSubTab] = useState<"credentials" | "securityPin">("credentials");

  // فرم تغییر نام کاربری و رمز
  const [credentialForm, setCredentialForm] = useState({
    oldUsername: "",
    oldPassword: "",
    newUsername: "",
    newPassword: "",
  });
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [credentialMessage, setCredentialMessage] = useState({ text: "", type: "" });

  // فرم مدیریت پین امنیتی ۸ رقمی
  const [pinForm, setPinForm] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState({ text: "", type: "" });

  // نمایش/مخفی کردن پسوردها
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // مودال امنیتی تب‌های حساس
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [securityCode, setSecurityCode] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityError, setSecurityError] = useState("");
  
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { handleLogout(); }, 300000);
    };
    const events = ["mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => { window.addEventListener(event, resetTimer); });
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => { window.removeEventListener(event, resetTimer); });
    };
  }, []);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/check-auth", { cache: "no-store" });
        const data = await res.json();
        if (!data.success && !data.isLoggedIn) {
          window.location.href = "/";
          return;
        }
      } catch {
        window.location.href = "/";
        return;
      }
      setIsChecking(false);
    }
    verifyAuth();
  }, []);

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

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (res?.success && res.stats) {
        setAdminStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    }
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
        fetchAdminStats();
        return true;
      }
    } catch {
      showMessage("error", "خطا در ارتباط با سرور");
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin-logout", { method: "POST" });
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  const handleTabClick = (tabId: string) => {
    if (sensitiveTabs.includes(tabId)) {
      setPendingTab(tabId);
      setSecurityError("");
      setSecurityCode("");
      setIsSecurityModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityError("");

    try {
      const res = await fetch("/api/admin/security-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSecurityModalOpen(false);
        if (pendingTab) {
          setActiveTab(pendingTab);
        }
        setPendingTab(null);
        setSecurityCode("");
      } else {
        setSecurityError(data.message || "کد امنیتی اشتباه است.");
      }
    } catch {
      setSecurityError("خطا در ارتباط با سرور.");
    } finally {
      setSecurityLoading(false);
    }
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

  if (isChecking) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-bold text-sm">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => {
                setIsCredentialModalOpen(true);
                setActiveCredentialSubTab("credentials");
              }}
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

      {/* مدال امنیتی ورود به تب‌ها */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100 text-right">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-amber-100">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-gray-900 text-center mb-1">
              محافظت امنیتی بخش حساس
            </h3>
            <p className="text-xs text-gray-500 text-center mb-5">
              لطفاً کد امنیتی ۸ رقمی خود را وارد کنید.
            </p>

            {securityError && (
              <div className="p-3 mb-4 rounded-xl text-xs bg-red-50 text-red-700 border border-red-200 flex items-start gap-2 leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{securityError}</span>
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  کد امنیتی ۸ رقمی
                </label>
                <div className="relative">
                  <input
                    type={showSecurityCode ? "text" : "password"}
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    required
                    maxLength={8}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono tracking-widest text-center"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecurityCode(!showSecurityCode)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showSecurityCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition font-bold text-sm disabled:opacity-50 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {securityLoading ? "در حال بررسی..." : "تایید و ورود"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSecurityModalOpen(false);
                    setPendingTab(null);
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-bold text-sm cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مدال تنظیمات حساب و امنیت (دو تب مجزا) */}
      {isCredentialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsCredentialModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* سوییچ بین دو بخش مودال */}
            <div className="flex border-b border-gray-200 mb-4 text-right">
              <button
                type="button"
                onClick={() => setActiveCredentialSubTab("credentials")}
                className={`flex-1 pb-3 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeCredentialSubTab === "credentials" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
                }`}
              >
                <UserCog className="w-4 h-4" />
                <span>نام کاربری و رمز</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCredentialSubTab("securityPin")}
                className={`flex-1 pb-3 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeCredentialSubTab === "securityPin" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>کد امنیتی ۸ رقمی تب‌ها</span>
              </button>
            </div>

            {/* بخش اول: تغییر نام کاربری و رمز عبور اصلی */}
            {activeCredentialSubTab === "credentials" ? (
              <div>
                <h2 className="text-base font-black text-gray-900 mb-3 text-right">تغییر نام کاربری و رمز ورود ادمین</h2>
                {credentialMessage.text && (
                  <div className={`p-3 mb-3 rounded-xl text-xs text-right ${credentialMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {credentialMessage.text}
                  </div>
                )}
                <form onSubmit={handleCredentialSubmit} className="space-y-3 text-right">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری فعلی</label>
                    <input type="text" name="oldUsername" value={credentialForm.oldUsername} onChange={handleCredentialChange} required className="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" placeholder="نام کاربری فعلی" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور فعلی</label>
                    <div className="relative">
                      <input type={showOldPassword ? "text" : "password"} name="oldPassword" value={credentialForm.oldPassword} onChange={handleCredentialChange} required className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <hr className="my-1 border-gray-100" />
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری جدید</label>
                    <input type="text" name="newUsername" value={credentialForm.newUsername} onChange={handleCredentialChange} required className="w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="نام کاربری جدید" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور جدید (۶ تا ۸ کاراکتر)</label>
                    <div className="relative">
                      <input type={showNewPassword ? "text" : "password"} name="newPassword" value={credentialForm.newPassword} onChange={handleCredentialChange} required maxLength={8} className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="رمز جدید" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={credentialLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition cursor-pointer mt-2">
                    {credentialLoading ? "در حال ذخیره..." : "ثبت تغییرات حساب"}
                  </button>
                </form>
              </div>
            ) : (
              /* بخش دوم: تعیین یا تغییر کد امنیتی ۸ رقمی فقط عدد */
              <div>
                <h2 className="text-base font-black text-gray-900 mb-1 text-right">مدیریت کد امنیتی ۸ رقمی تب‌ها</h2>
                <p className="text-[11px] text-gray-500 mb-3 text-right">برای ورود به بخش‌های حساس، این پین ۸ رقمی عددی الزامی است.</p>
                {pinMessage.text && (
                  <div className={`p-3 mb-3 rounded-xl text-xs text-right ${pinMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {pinMessage.text}
                  </div>
                )}
                <form onSubmit={handlePinSubmit} className="space-y-3 text-right">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">کد امنیتی قبلی (اگر قبلاً تعیین شده)</label>
                    <div className="relative">
                      <input type={showOldPin ? "text" : "password"} name="oldPin" value={pinForm.oldPin} onChange={handlePinChange} maxLength={8} className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl bg-gray-50 font-mono tracking-widest text-center" placeholder="اختیاری (برای بار اول خالی بگذارید)" />
                      <button type="button" onClick={() => setShowOldPin(!showOldPin)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        {showOldPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">کد امنیتی جدید (دقیقاً ۸ رقم عدد)</label>
                    <div className="relative">
                      <input type={showNewPin ? "text" : "password"} name="newPin" value={pinForm.newPin} onChange={handlePinChange} required maxLength={8} className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl font-mono tracking-widest text-center" placeholder="12345678" />
                      <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">تکرار کد امنیتی جدید</label>
                    <div className="relative">
                      <input type={showConfirmPin ? "text" : "password"} name="confirmPin" value={pinForm.confirmPin} onChange={handlePinChange} required maxLength={8} className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl font-mono tracking-widest text-center" placeholder="12345678" />
                      <button type="button" onClick={() => setShowConfirmPin(!showConfirmPin)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={pinLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm transition cursor-pointer mt-2">
                    {pinLoading ? "در حال ثبت..." : "ثبت و فعال‌سازی کد امنیتی"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

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