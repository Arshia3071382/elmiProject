"use client";

import {
  Calendar,
  Bell,
  BookOpen,
  MessageSquare,
  Trophy,
  FileText,
  CheckSquare,
} from "lucide-react";

interface AdminModulesGridProps {
  permissions: string[];
  onSelectTab: (tab: string) => void;
}

export default function AdminModulesGrid({
  permissions,
  onSelectTab,
}: AdminModulesGridProps) {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-700 mb-4 px-1">
        دسترسی‌های سامانه
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {permissions?.includes("calendar") && (
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
                تنظیم روزهای ماه، تاریخ‌ها و رویدادهای تقویم آموزشی سامانه.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("calendar")}
              className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-blue-600 cursor-pointer"
            >
              ورود به مدیریت تقویم
            </button>
          </div>
        )}

        {permissions?.includes("notices") && (
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
              onClick={() => onSelectTab("notices")}
              className="w-full py-2.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-emerald-600 cursor-pointer"
            >
              ورود به اطلاعیه‌ها
            </button>
          </div>
        )}

        {permissions?.includes("courses") && (
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
              onClick={() => onSelectTab("courses")}
              className="w-full py-2.5 bg-slate-50 hover:bg-violet-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-violet-600 cursor-pointer"
            >
              ورود به دوره‌ها
            </button>
          </div>
        )}

        {permissions?.includes("counseling") && (
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
              onClick={() => onSelectTab("counseling")}
              className="w-full py-2.5 bg-slate-50 hover:bg-amber-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-amber-600 cursor-pointer"
            >
              ورود به مشاوره
            </button>
          </div>
        )}

        {permissions?.includes("grade_league") && (
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
              onClick={() => onSelectTab("grade_league")}
              className="w-full py-2.5 bg-slate-50 hover:bg-yellow-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-yellow-600 cursor-pointer"
            >
              ورود به لیگ علمی پایه
            </button>
          </div>
        )}

        {permissions?.includes("exams") && (
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
              onClick={() => onSelectTab("exams")}
              className="w-full py-2.5 bg-slate-50 hover:bg-rose-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-rose-600 cursor-pointer"
            >
              ورود به مدیریت آزمون‌ها
            </button>
          </div>
        )}

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-105 transition-transform">
                <CheckSquare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-teal-50 text-teal-600 rounded-lg">
                فعال
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">
              مدیریت چک‌لیست‌ها
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              ثبت و پیگیری سریع نکات کلاس در چهار دسته‌بندی اصلی.
            </p>
          </div>
          <button
            onClick={() => onSelectTab("checklist")}
            className="w-full py-2.5 bg-slate-50 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/60 hover:border-teal-600 cursor-pointer"
          >
            ورود به مدیریت چک‌لیست‌ها
          </button>
        </div>
      </div>
    </div>
  );
}