"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard, 
  Layers,
  Loader2
} from "lucide-react";
import AdminCalendarPanel from "@/component/adminpaneldet/AdminCalendarPanel";

export default function SeniorAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [activeUser, setActiveUser] = useState<string>("معین ارشد");

  // مدیریت تب فعال
  const [activeTab, setActiveTab] = useState<"calendar" | "general">("calendar");

  // سیستم توست / پیام‌های بازخورد
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // بررسی وضعیت احراز هویت موقع لود شدن صفحه
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/senior-admin/check-auth");
        const data = await res.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          if (data.user?.username) {
            setActiveUser(data.user.username);
          }
        } else {
          // اگر لاگین نکرده بود، هدایت به صفحه اصلی (یا باز کردن مودال هدر)
          setIsAuthenticated(false);
          router.push("/");
        }
      } catch {
        // در صورت عدم وجود route چک آنلاین، به‌صورت پیش‌فرض وارد صفحه می‌شود
        setIsAuthenticated(true);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/senior-admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    router.push("/");
  };

  // ۱. حالت در حال بررسی احراز هویت (جایگزین مودال سیاه)
  if (isCheckingAuth) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-sm font-bold text-slate-700">در حال بررسی دسترسی...</span>
        </div>
      </div>
    );
  }

  // ۲. اگر احراز هویت تایید نشد، چیزی رندر نمی‌شود (هدایت می‌شود)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 font-[iranSans-r] pt-24 pb-12">
      
      {/* پیام‌رسان شناور (Toast) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-xl border flex items-center gap-3 text-sm font-bold ${
              toastMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <Sparkles className="w-5 h-5 animate-pulse text-emerald-600" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* فضای اصلی پنل مدیریت اختصاصی */}
      <div className="max-w-6xl mx-auto px-4">
        
        {/* هدر خوش‌آمدگویی */}
        <header className="mb-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 font-iranBold flex items-center gap-2">
                <span>داوود جووووون</span>
                <span className="text-blue-600"> خوش اومدی! 🔥</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                پنل اختصاصی مدیریت دسترسی‌ها و تقویم علمی
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all duration-200 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            خروج از حساب
          </button>
        </header>

        {/* تب‌های مدیریتی */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200 mb-6 gap-2 w-fit">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
              activeTab === "calendar"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4" />
            تقویم علمی
          </button>

          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
              activeTab === "general"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            سایر دسترسی‌ها
          </button>
        </div>

        {/* محتوای تب فعال */}
        <AnimatePresence mode="wait">
          {activeTab === "calendar" ? (
            <motion.div
              key="tab-calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminCalendarPanel onShowMessage={showToast} />
            </motion.div>
          ) : (
            <motion.div
              key="tab-general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                دسترسی‌های بعدی معین‌های ارشد
              </h3>
              <p className="text-slate-500 text-xs">
                این بخش آماده پذیرش ابزارها و ماژول‌های بعدی شماست.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}