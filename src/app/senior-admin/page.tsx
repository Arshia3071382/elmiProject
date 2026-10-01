"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, LogOut, UserCheck, ArrowRight } from "lucide-react";

import AdminCalendarPanel from "@/component/adminpaneldet/AdminCalendarPanel";
import AdminGradeLeaguePanel from "@/component/adminpaneldet/AdminGradeLeaguePanel";
import AdminExamsPanel from "@/component/adminpaneldet/AdminExamsPanel";
import StatsCards from "@/component/adminpaneldet/StatsCards";
import Container from "@/component/Container";

// ایمپورت از پوشه جدیدی که ساختید
import ChecklistManagementPanel from "@/component/seniorAdmin/ChecklistManagementPanel";
import AdminModulesGrid from "@/component/seniorAdmin/AdminModulesGrid";

interface AdminUser {
  username: string;
  name: string;
  permissions: string[];
}

export default function SeniorAdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [adminStats, setAdminStats] = useState({
    categoriesCount: 0,
    coursesCount: 0,
    averageCourses: 0,
    elementaryGrades: [] as { grade: number; count: number }[],
    middleGrades: [] as { grade: number; count: number }[],
  });

  const handleShowMessage = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      if (res?.success && res.stats) {
        setAdminStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/senior-admin/me", {
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok && data.success && data.user) {
          setUser(data.user);
          fetchAdminStats();
        } else {
          setError(data.error || "خطا در دریافت اطلاعات کاربر");
        }
      } catch {
        setError("خطا در برقراری ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [fetchAdminStats]);

  const handleLogout = async () => {
    try {
      await fetch("/api/senior-admin/logout", {
        method: "POST",
      });

      window.history.replaceState(null, "", "/");
      window.location.replace("/");
    } catch {
      window.location.replace("/");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">
            در حال بارگذاری اطلاعات پنل معین...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50 p-4"
        dir="rtl"
      >
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center text-rose-700 max-w-md shadow-sm">
          <p className="text-sm font-bold mb-2">خطا در دسترسی به پنل</p>
          <p className="text-xs mb-4">{error}</p>
          <button
            onClick={() => window.location.replace("/")}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div
        className="min-h-screen mt-2 sm:mt-10 bg-slate-50/60 p-4 md:p-8"
        dir="rtl"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          {toastMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold shadow-md transition-all ${
                toastMessage.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              {toastMessage.text}
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-500/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>پنل اختصاصی معین علمی</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight">
                  سلام معین عزیز،{" "}
                  <span className="text-amber-300">
                    {user?.name || user?.username}
                  </span>{" "}
                  خوش اومدی!
                </h1>
                <p className="text-xs md:text-sm text-blue-100/90 mt-1">
                  به سامانه مدیریت هوشمند علمی منتظران خوش آمدید. ماژول‌های فعال
                  شما در زیر قرار دارند.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/15 text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span className="font-bold">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-white/10 hover:bg-rose-500/80 text-white rounded-2xl border border-white/15 transition-all active:scale-95 cursor-pointer"
                  title="خروج از حساب"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {activeTab && (
            <button
              onClick={() => setActiveTab(null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به لیست ماژول‌ها</span>
            </button>
          )}

          {activeTab === "calendar" &&
          user?.permissions?.includes("calendar") ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-sm">
              <AdminCalendarPanel onShowMessage={handleShowMessage} />
            </div>
          ) : activeTab === "grade_league" &&
            user?.permissions?.includes("grade_league") ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-sm">
              <AdminGradeLeaguePanel />
            </div>
          ) : activeTab === "exams" && user?.permissions?.includes("exams") ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-sm">
              <AdminExamsPanel />
            </div>
          ) : activeTab === "checklist" ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-sm">
              <ChecklistManagementPanel onShowMessage={handleShowMessage} />
            </div>
          ) : (
            <div className="space-y-6">
              <StatsCards
                categoriesCount={adminStats.categoriesCount}
                coursesCount={adminStats.coursesCount}
                averageCourses={adminStats.averageCourses}
                elementaryGrades={adminStats.elementaryGrades}
                middleGrades={adminStats.middleGrades}
              />

              <AdminModulesGrid
                permissions={user?.permissions || []}
                onSelectTab={setActiveTab}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
