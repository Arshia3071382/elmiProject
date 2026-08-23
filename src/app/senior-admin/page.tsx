"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Calendar,
  Bell,
  BookOpen,
  MessageSquare,
  LogOut,
  UserCheck,
  ArrowRight,
  Trophy,
  FileText,
} from "lucide-react";

import AdminCalendarPanel from "@/component/adminpaneldet/AdminCalendarPanel";
import AdminGradeLeaguePanel from "@/component/adminpaneldet/AdminGradeLeaguePanel";
import AdminExamsPanel from "@/component/adminpaneldet/AdminExamsPanel";
import Container from "@/component/Container";

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

  const handleShowMessage = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/senior-admin/me");
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
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
  }, []);

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
            در حال بارگذاری اطلاعات پنل...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    window.location.replace("/");
    return null;
  }

  return (
    <Container>
      <div className="min-h-screen mt-10 sm:mt-30 bg-slate-50/60 p-4 md:p-8" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* پیام‌های شناور */}
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

          {/* هدر پنل معین */}
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
                  className="p-2.5 bg-white/10 hover:bg-rose-500/80 text-white rounded-2xl border border-white/15 transition-all active:scale-95"
                  title="خروج از حساب"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* دکمه بازگشت به لیست ماژول‌ها */}
          {activeTab && (
            <button
              onClick={() => setActiveTab(null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به لیست ماژول‌ها</span>
            </button>
          )}
          {/* نمایش ماژول انتخاب شده */}
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
              {/* اصلاح شد: بدون ارسال پروپ اضافی */}
              <AdminExamsPanel />
            </div>
          ) : (
            /* لیست تمامی کارت‌های دسترسی معین */
            // ...
            /* لیست تمامی کارت‌های دسترسی معین */
            <div>
              <h2 className="text-sm font-bold text-slate-700 mb-4 px-1">
                دسترسی‌های فعال شما
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ماژول تقویم */}
                {user?.permissions?.includes("calendar") && (
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg">
                          فعال
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        مدیریت تقویم آموزشی
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        تنظیم روزهای ماه، تاریخ‌ها و رویدادهای تقویم آموزشی
                        سامانه.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("calendar")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-blue-600"
                    >
                      ورود به مدیریت تقویم
                    </button>
                  </div>
                )}

                {/* ماژول اطلاعیه‌ها */}
                {user?.permissions?.includes("notices") && (
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                          <Bell className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                          فعال
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        مدیریت اطلاعیه‌ها
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        ارسال، ویرایش و انتشار اطلاعیه‌ها و بنرهای خبری سامانه.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("notices")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-emerald-600"
                    >
                      ورود به اطلاعیه‌ها
                    </button>
                  </div>
                )}

                {/* ماژول دوره‌ها */}
                {user?.permissions?.includes("courses") && (
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:scale-105 transition-transform">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-violet-50 text-violet-600 rounded-lg">
                          فعال
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        مدیریت دوره‌های آموزشی
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        مدیریت سرفصل‌ها، فایل‌ها و محتوای دوره‌های آموزشی.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-violet-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-violet-600"
                    >
                      ورود به دوره‌ها
                    </button>
                  </div>
                )}

                {/* ماژول مشاوره */}
                {user?.permissions?.includes("counseling") && (
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg">
                          فعال
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        اتاق‌های مشاوره
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        پاسخگویی و هدایت چت‌های مشاوره کاربران و متقاضیان.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("counseling")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-amber-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-amber-600"
                    >
                      ورود به مشاوره
                    </button>
                  </div>
                )}

                {/* ماژول لیگ علمی پایه */}
                {user?.permissions?.includes("grade_league") && (
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl group-hover:scale-105 transition-transform">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-lg">
                          فعال
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        لیگ علمی پایه
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        مدیریت، نظارت و ارزیابی فعالیت‌های لیگ علمی پایه.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("grade_league")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-yellow-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-yellow-600"
                    >
                      ورود به لیگ علمی پایه
                    </button>
                  </div>
                )}

                {/* ماژول مدیریت آزمون‌ها */}
                {user?.permissions?.includes("exams") && (
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg">
                          فعال
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        مدیریت آزمون‌ها و کارنامه‌ها
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        ایجاد، ویرایش، حذف آزمون‌ها و مدیریت نتایج و کارنامه‌ها.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("exams")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-rose-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-rose-600"
                    >
                      ورود به مدیریت آزمون‌ها
                    </button>
                  </div>
                )}
              </div>

              {/* در صورت عدم وجود هیچ دسترسی */}
              {(!user?.permissions || user.permissions.length === 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-800">
                  <p className="text-xs font-bold">
                    هیچ دسترسی مشخصی برای حساب شما تعریف نشده است. لطفاً با مدیر
                    سیستم تماس بگیرید.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
