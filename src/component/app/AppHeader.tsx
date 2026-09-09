"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, User } from "lucide-react";
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

  const handleProfileClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      localStorage.removeItem("studentNationalId");
      localStorage.removeItem("studentPhone");
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      {/* 
        تغییرات:
        - حذف backdrop-blur-md برای جلوگیری از باگ GPU Rendering در Safari iOS
        - استفاده از z-30 و bg-white
      */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-sm">
        {/* دکمه پروفایل / ورود */}
        <button
          onClick={handleProfileClick}
          className="p-2.5 rounded-full bg-blue-50 text-blue-600 active:scale-95 transition-all hover:bg-blue-100 border border-blue-100"
          aria-label="ورود / حساب کاربری"
        >
          <User className="w-5 h-5 text-blue-600" />
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

        {/* دکمه اعلانات */}
        <button
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-all hover:bg-gray-100"
          aria-label="اعلانات"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>
      </header>

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