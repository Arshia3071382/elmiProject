"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Bell, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  Info, 
  PhoneCall, 
  Trophy, 
  Rocket, 
  GraduationCap, 
  ChevronLeft,
  Sparkles
} from "lucide-react";
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

interface AppHeaderProps {
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
}

export default function AppHeader({
  onNotificationClick,
  onMenuClick,
}: AppHeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setIsDrawerOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* 
        هدر اصلی
      */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-sm">
        {/* دکمه منوی همبرگری (سمت راست) */}
        <button
          onClick={toggleDrawer}
          className="p-2.5 rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-all hover:bg-gray-100 border border-gray-100"
          aria-label="منوی اصلی"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* لوگوی مرکز هدر */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-11 h-11 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 shadow-md shadow-blue-500/20 active:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center overflow-hidden">
              <Image
                src="/icons/logo6.png"
                alt="علمی منتظران"
                width={38}
                height={38}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* دکمه اعلانات (سمت چپ) */}
        <button
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-all hover:bg-gray-100"
          aria-label="اعلانات"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>
      </header>

      {/* 
        منوی همبرگری کشویی (Drawer Navigation)
      */}
      {/* Backdrop (پس‌زمینه تاریک) */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* کشو منو */}
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 overflow-y-auto">
          {/* هدر داخل منو */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-[iranBold] text-slate-800">علمی منتظران</h2>
                <p className="text-[10px] text-slate-400">پلتفرم آموزشی هوشمند</p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl bg-gray-100/80 text-gray-500 hover:bg-gray-200 transition-colors"
              aria-label="بستن منو"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* دکمه‌های ورود و ثبت‌نام */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsLoginOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 font-[iranBold] text-xs hover:bg-blue-100 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              ورود
            </button>

            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsRegisterOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-[iranBold] text-xs hover:bg-emerald-100 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              ثبت‌نام
            </button>
          </div>

          {/* لیست صفحات اصلی */}
          <div className="space-y-4">
            <span className="text-[11px] font-[iranBold] text-slate-400 block px-1">
              صفحات اصلی
            </span>

            <nav className="space-y-1">
              {/* درباره ما */}
              <Link
                href="/aboutUs"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-[iranBold]">درباره ما</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </Link>

              {/* ارتباط با ما */}
              <Link
                href="/contactUs"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-[iranBold]">ارتباط با ما</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </Link>

              {/* آشنایی با اساتید مجموعه */}
              <Link
                href="/teachers"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-[iranBold]">معرفی اساتید</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </Link>

              {/* آشنایی با لیگ نخبگان */}
              <Link
                href="/league-guide"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-[iranBold]">آشنایی با لیگ نخبگان</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </Link>

              {/* آشنایی با برهان */}
              <Link
                href="/borhan"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-[iranBold]">آشنایی با برهان</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* مودال‌های ورود و ثبت‌نام */}
      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}