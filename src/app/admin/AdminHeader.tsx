// Admin header component
"use client";

import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
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
              مدیریت یکپارچه دوره‌ها، گروه‌ها، اطلاعیه‌ها، آزمون‌ها و پادکست‌های علمی
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/90 text-white border border-white/20 hover:border-red-500 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95 font-bold text-xs sm:text-sm cursor-pointer w-full md:w-auto"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>خروج از پنل</span>
        </button>
      </div>
    </header>
  );
}