"use client";

import Image from "next/image";
import { Bell, User } from "lucide-react";

interface AppHeaderProps {
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
}

export default function AppHeader({
  onNotificationClick,
  onMenuClick,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-sm">
      {/* دکمه سمت راست: پروفایل / منو */}
      <button
        onClick={onMenuClick}
        className="p-2.5 rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-all hover:bg-gray-100"
        aria-label="پروفایل"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>

      {/* لوگوی وسط: سایز بزرگ‌تر، بدون متن و متمرکز */}
      <div className="relative flex items-center justify-center">
        <div className="relative w-12 h-12 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 shadow-md shadow-blue-500/20 active:scale-105 transition-transform duration-300">
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
      </div>

      {/* دکمه سمت چپ: اعلانات */}
      <button
        onClick={onNotificationClick}
        className="relative p-2.5 rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-all hover:bg-gray-100"
        aria-label="اعلانات"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
      </button>
    </header>
  );
}