"use client";

import { useState } from "react";
import Image from "next/image";
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
        بهینه‌سازی‌های انجام شده:
        ۱. حذف backdrop-blur جهت جلوگیری ازافت فریم در iOS
        ۲. جایگزینی دایره نورانی بلر شده با Radial Gradient نوری بهینه
        ۳. اضافه کردن transform-gpu برای روان‌سازی
      */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-5 text-white shadow-xl shadow-indigo-500/20 transform-gpu">
        
        {/* پس‌زمینه نوری سبک و بدون افت فریم */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex-1 space-y-2.5">
            {/* بج عنوان - حذف backdrop-blur و استفاده از bg-white/20 ساده */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-amber-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isLoggedIn ? `خوش آمدی، ${studentName}` : "مجموعه علمی منتظران"}
              </span>
            </div>

            <h2 className="text-lg font-bold leading-snug">
              {isLoggedIn ? "آماده چالش امروز هستی؟" : "برای دسترسی به امکانات وارد شوید"}
            </h2>

            <p className="text-xs text-blue-100/90 leading-relaxed">
              {subtitle}
            </p>

            {/* دکمه‌های ورود / ثبت‌نام */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleOpenLogin}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md active:scale-95 transition-transform hover:bg-blue-50"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>ورود</span>
                </button>

                <button
                  onClick={handleOpenRegister}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-transform hover:bg-emerald-600"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ثبت‌نام</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onActionClick}
                className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md active:scale-95 transition-transform hover:bg-blue-50"
              >
                {buttonText}
              </button>
            )}
          </div>

          {/* کادر لوگو - جایگزینی backdrop-blur با bg-white/15 */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center bg-white/15 rounded-2xl p-2 border border-white/20">
            <Image
              src="/icons/logo6.png"
              alt="علمی منتظران"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
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