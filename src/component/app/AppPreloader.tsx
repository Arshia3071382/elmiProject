"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AppPreloaderProps {
  onComplete: () => void;
  duration?: number;
}

export default function AppPreloader({
  onComplete,
  duration = 3000,
}: AppPreloaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // محو شدن افکت (Fade out) قبل از خروج کامل
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-white py-16 px-6 transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      dir="rtl"
    >
      <div />

      {/* بخش مرکزی: لوگوی خالص بدون پس‌زمینه و بدون پرش */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative w-32 h-32 flex items-center justify-center transition-transform duration-700 transform scale-100">
          <Image
            src="/icons/logo6.png"
            alt="مجموعه علمی منتظران"
            width={128}
            height={128}
            className="object-contain w-full h-full"
            priority
          />
        </div>

        {/* عنوان مجموعه */}
        <div className="space-y-2">
          <h1 className="text-2xl font-[iranBold] text-[#0d52b5] tracking-wide">
            مجموعه علمی منتظران
          </h1>
          
        </div>
      </div>

      {/* نوار پیشرفت ۳ ثانیه‌ای */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[160px]">
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0d52b5] rounded-full transition-all ease-out"
            style={{
              width: fadeOut ? "100%" : "0%",
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}