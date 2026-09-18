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
  const [startProgress, setStartProgress] = useState(false);

  useEffect(() => {
    // استفاده از requestAnimationFrame برای هماهنگی کامل با رندر فریم‌رِیت سافاری و اندروید
    const frameId = requestAnimationFrame(() => {
      setStartProgress(true);
    });

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-white py-16 px-6 transition-opacity duration-500 select-none pointer-events-auto ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        // حل مشکل ارتفاع داینامیک نوار آدرس در سافاری آیفون (Viewport Fix)
        height: "-webkit-fill-available",
      }}
      dir="rtl"
    >
      <div />

      {/* بخش مرکزی: فقط لوگوی بسیار بزرگ بدون متن */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          <Image
            src="/icons/logo6.png"
            alt="لوگو"
            width={256}
            height={256}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      {/* نوار پیشرفت ۳ ثانیه‌ای */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[220px] pb-4">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0d52b5] rounded-full transition-all ease-out"
            style={{
              width: startProgress ? "100%" : "0%",
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}