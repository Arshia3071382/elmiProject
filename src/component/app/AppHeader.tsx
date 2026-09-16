"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  Trophy, 
  Rocket, 
  GraduationCap, 
  ChevronLeft,
  Sparkles
} from "lucide-react";
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export default function AppHeader({
  onMenuClick,
}: AppHeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDrawer = () => {
    if (onMenuClick) {
      onMenuClick();
    }
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      {/* هدر اصلی با ارتفاع بیشتر (py-5.5) */}
      <header className="sticky top-0 z-30 bg-[#0d52b5] border-b border-blue-400/20 px-4 py-3.5 flex items-center justify-between shadow-md shadow-blue-900/20" dir="rtl">
        
        {/* سمت راست: لوگو و عنوان */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-full p-0.5 bg-white/20 shadow-sm">
            <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center overflow-hidden">
              <Image
                src="/icons/logo6.png"
                alt="علمی منتظران"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
          
          <span className="text-base sm:text-lg font-[iranBold] tracking-tight select-none text-white">
            عـلـــــمـی منتظرانــــ
          </span>
        </div>

        {/* سمت چپ: آیکون‌های ورود و ثبت‌نام (استایل همسان شیشه‌ای) + منوی همبرگری */}
        <div className="flex items-center gap-2">
          {/* آیکون ورود */}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 active:scale-95 transition-all flex items-center justify-center"
            title="ورود"
            aria-label="ورود"
          >
            <LogIn className="w-4 h-4 text-white" />
          </button>
          
          {/* آیکون ثبت‌نام (دقیقاً مشابه ورود بدون بک‌گراند سفید) */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 active:scale-95 transition-all flex items-center justify-center"
            title="ثبت‌نام"
            aria-label="ثبت‌نام"
          >
            <UserPlus className="w-4 h-4 text-white" />
          </button>

          {/* دکمه منوی همبرگری (انتهای سمت چپ) */}
          <button
            onClick={toggleDrawer}
            className="p-2.5 mr-0.5 rounded-xl bg-white/10 text-white active:scale-95 transition-all hover:bg-white/20 border border-white/10 flex items-center justify-center"
            aria-label="منوی اصلی"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* منوی کشویی منتقل شده به ریشه صفحه (Portal) */}
      {isMounted && createPortal(
        <>
          {/* پس‌زمینه تاریک (Overlay) */}
          {isDrawerOpen && (
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            />
          )}

          {/* کشو منو */}
          <aside
            dir="rtl"
            className={`fixed top-0 right-0 bottom-0 z-[9999] w-[82%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-5 overflow-y-auto h-full">
              {/* هدر داخل منو */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 
                      className="text-sm font-[iranBold]"
                      style={{ color: "#1F3A5F" }}
                    >
                      عـلـــــمـی منتظرانــــ
                    </h2>
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

              {/* دکمه‌های ورود و ثبت‌نام داخل کشو */}
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

              {/* لیست آیتم‌ها */}
              <div className="space-y-4">
                <span className="text-[11px] font-[iranBold] text-slate-400 block px-1">
                  دسترسی‌های سریع
                </span>

                <nav className="space-y-1">
                  <Link
                    href="/elite-league/about"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-[iranBold]">آشنایی با لیگ نخبگان</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                  </Link>

                  <Link
                    href="/borhan"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-[iranBold]">آشنایی با برهان</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                  </Link>

                  <Link
                    href="/teachers"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-[iranBold]">آشنایی با اساتید</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </>,
        document.body
      )}

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