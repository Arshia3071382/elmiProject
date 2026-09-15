"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface AppCountdownBannerProps {
  targetDate?: string;
  targetUrl?: string;
  imageSrc?: string;
}

export default function AppCountdownBanner({
  // ۱ خرداد ۱۴۰۶ (استفاده از فرمت ایزو بدون Z یا با جایگزینی امن در تابع)
  targetDate = "2027-05-22T00:00:00",
  targetUrl = "/elite-league",
  imageSrc = "/image/appHero.jpg",
}: AppCountdownBannerProps) {
  
  // تابع محاسبه زمان باقی‌مانده (کاملاً ایمن برای Safari و Vercel)
  const getTimeRemaining = useCallback((targetISO: string) => {
    // جایگزینی space به جای T برای سازگاری کامل با مرورگرها
    const formattedDate = targetISO.replace(/-/g, "/").replace("T", " ");
    const target = new Date(formattedDate).getTime();
    const now = Date.now();
    const difference = target - now;

    if (isNaN(target) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // اولین محاسبه بلافاصله روی کلاینت
    setTimeLeft(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, getTimeRemaining]);

  // تا زمانی که کامپوننت روی کلاینت سوار نشده باشد، مقادیر صفر نمایش داده می‌شوند
  const displayTime = isMounted ? timeLeft : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <Link
      href={targetUrl}
      className="block w-full relative rounded-3xl overflow-hidden my-3 min-h-[170px] border border-white/20 active:scale-[0.99] transition-transform shadow-md group"
    >
      {/* عکس پس‌زمینه */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="پوستر لیگ نخبگان"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* افکت شهاب‌سنگ‌های طبیعی در پس‌زمینه */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute -top-6 -right-10 w-[140px] sm:w-[180px] h-[2px] rotate-[215deg] animate-[naturalMeteor_3s_ease-out_infinite] opacity-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(253, 230, 138, 1) 0%, rgba(249, 115, 22, 0.8) 25%, rgba(239, 68, 68, 0.4) 60%, transparent 100%)",
            }}
          />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_3px_rgba(253,230,138,0.9),0_0_16px_6px_rgba(249,115,22,0.6)]" />
        </div>

        <div className="absolute top-4 right-[20%] w-[100px] h-[1.5px] rotate-[215deg] animate-[naturalMeteor_4.2s_ease-out_infinite_1.5s] opacity-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(56, 189, 248, 0.7) 30%, transparent 100%)",
            }}
          />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(56,189,248,0.9)]" />
        </div>

        <div className="absolute -top-2 right-[50%] w-[120px] h-[1.5px] rotate-[215deg] animate-[naturalMeteor_3.5s_ease-out_infinite_0.8s] opacity-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(253, 230, 138, 0.9) 0%, rgba(249, 115, 22, 0.5) 40%, transparent 100%)",
            }}
          />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(253,230,138,0.8)]" />
        </div>

        <div className="absolute top-2 right-4 w-16 h-16 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes naturalMeteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          65% {
            opacity: 0.95;
          }
          100% {
            transform: rotate(215deg) translateX(-320px);
            opacity: 0;
          }
        }
      `}</style>

      {/* محتوای بنر و تایمر */}
      <div className="relative z-10 p-4 h-full min-h-[170px] flex flex-col justify-center items-start max-w-[55%] text-white gap-2 my-auto">
        <div className="flex items-center gap-1.5 w-full" dir="rtl">
          {/* روز */}
          <div className="flex flex-col items-center bg-black/45 backdrop-blur-md px-1.5 py-1 rounded-xl flex-1 border border-white/15">
            <span className="text-xs font-[iranBold] text-white leading-none">
              {String(displayTime.days).padStart(2, "0")}
            </span>
            <span className="text-[8px] text-slate-200 mt-0.5 font-[iranRegular]">
              روز
            </span>
          </div>

          {/* ساعت */}
          <div className="flex flex-col items-center bg-black/45 backdrop-blur-md px-1.5 py-1 rounded-xl flex-1 border border-white/15">
            <span className="text-xs font-[iranBold] text-white leading-none">
              {String(displayTime.hours).padStart(2, "0")}
            </span>
            <span className="text-[8px] text-slate-200 mt-0.5 font-[iranRegular]">
              ساعت
            </span>
          </div>

          {/* دقیقه */}
          <div className="flex flex-col items-center bg-black/45 backdrop-blur-md px-1.5 py-1 rounded-xl flex-1 border border-white/15">
            <span className="text-xs font-[iranBold] text-white leading-none">
              {String(displayTime.minutes).padStart(2, "0")}
            </span>
            <span className="text-[8px] text-slate-200 mt-0.5 font-[iranRegular]">
              دقیقه
            </span>
          </div>

          {/* ثانیه */}
          <div className="flex flex-col items-center bg-amber-500/60 backdrop-blur-md px-1.5 py-1 rounded-xl flex-1 border border-amber-300/50">
            <span className="text-xs font-[iranBold] text-amber-200 leading-none">
              {String(displayTime.seconds).padStart(2, "0")}
            </span>
            <span className="text-[8px] text-amber-100 mt-0.5 font-[iranRegular]">
              ثانیه
            </span>
          </div>
        </div>

        {/* عنوان زیر تایمر */}
        <div className="bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl mt-0.5">
          <span className="text-[11px] font-[iranBold] text-amber-300 whitespace-nowrap">
            تا پایان لیگ نخبگان
          </span>
        </div>
      </div>
    </Link>
  );
}