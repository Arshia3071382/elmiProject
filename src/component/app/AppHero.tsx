"use client";

import { useState } from "react";
import { Sparkles, LogIn, UserPlus } from "lucide-react";
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

interface AppHeroProps {
  studentName?: string;
  isLoggedIn?: boolean;
  subtitle?: string;
  buttonText?: string;
  onActionClick?: () => void;
}

export default function AppHero({
  studentName = "دانش‌آموز",
  isLoggedIn = false,
  subtitle = "هر روز یک قدم به آینده نزدیک‌تر شو.",
  buttonText = "مشاهده برنامه امروز",
  onActionClick,
}: AppHeroProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenLogin = () => {
    localStorage.removeItem("studentNationalId");
    localStorage.removeItem("studentPhone");
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    localStorage.removeItem("studentNationalId");
    localStorage.removeItem("studentPhone");
    setIsRegisterOpen(true);
  };

  return (
    <>
      {/* 
        کارت با پس‌زمینه سفید، سایه مشخص و ارتفاع فشرده‌تر
      */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-white p-4 border border-gray-100 shadow-lg shadow-gray-200/50 transform-gpu"
        dir="rtl"
      >
        <div className="space-y-2">
          {/* نمایش بج خوش‌آمدگویی تنها در صورت ورود کاربر */}
          {isLoggedIn && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[11px] font-bold text-blue-700 border border-blue-100">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>خوش آمدی، {studentName}</span>
            </div>
          )}

          <h2 
            className="text-base font-bold leading-tight"
            style={{ color: "#1F3A5F" }}
          >
            {isLoggedIn ? "آماده چالش امروز هستی؟" : "برای دسترسی به امکانات وارد شوید"}
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed">
            {subtitle}
          </p>

          {/* دکمه‌های ورود / ثبت‌نام یا اکشن اصلی */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleOpenLogin}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1F3A5F] text-white font-bold text-xs shadow-sm active:scale-95 transition-all hover:bg-[#152741]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ورود</span>
              </button>

              <button
                onClick={handleOpenRegister}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all hover:bg-emerald-700"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ثبت‌نام</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onActionClick}
              className="mt-1 inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#1F3A5F] text-white font-bold text-xs shadow-sm active:scale-95 transition-all hover:bg-[#152741]"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>

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