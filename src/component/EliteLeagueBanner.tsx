"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function EliteLeagueBanner() {
  // تاریخ شروع رقابت: ۱ مهر ۱۴۰۵
  const targetDate = "2026-09-23T00:00:00";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(false);

  // State برای اسلایدر دو صفحه ای
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsStarted(false);
      } else {
        setIsStarted(true);
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // تغییر خودکار اسلایدر هر ۶ ثانیه
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // تابع تبدیل دقیق اعداد انگلیسی به فارسی برای تمام حالت‌ها (حتی زیر ۱۰ ثانیه)
  const formatNum = (num: number) => {
    const str = num < 10 ? `0${num}` : num.toString();
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:mt-30">
      {/* کانتینر اصلی بنر با border و هاله متغیر */}
      <motion.div 
        className={`
          relative overflow-hidden rounded-2xl bg-[#050505] py-6 sm:py-8 px-3 sm:px-12 text-[#F8FAFC]
          border-y sm:border
          transition-all duration-700
          ${
            currentSlide === 0 
              ? "border-[#F97316]/40 shadow-[0_0_60px_rgba(249,115,22,0.18)]" 
              : "border-emerald-300/50 shadow-[0_0_80px_rgba(34,197,94,0.15)]"
          }
        `}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* پس‌زمینه اسلاید اول (تاریک و فضایی) */}
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div 
              key="bg-1"
              className="absolute inset-0 pointer-events-none overflow-hidden z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(251, 191, 36, 0.08) 35%, transparent 70%)"
                }}
              />

              <motion.div
                animate={{ y: [-60, 60, -60], x: [-40, 40, -40], rotate: [0, 180, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 left-1/4 w-48 h-48 bg-gradient-to-br from-[#F97316]/25 to-[#EF4444]/5 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ y: [50, -50, 50], x: [30, -30, 30], rotate: [360, 180, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 right-1/4 w-64 h-64 bg-gradient-to-br from-[#FBBF24]/20 to-[#F97316]/10 rounded-full blur-3xl"
              />

              {[...Array(26)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -120, x: Math.random() * 1300, opacity: 0 }}
                  animate={{ y: 450, opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "linear",
                  }}
                  className="absolute w-[2px] h-16 bg-gradient-to-b from-[#F97316] via-[#FDE68A] to-transparent rotate-[35deg]"
                  style={{ left: `${i * 4}%` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* پس‌زمینه اسلاید دوم (سفید با هاله سبز کمرنگ) */}
        <AnimatePresence mode="wait">
          {currentSlide === 1 && (
            <motion.div 
              key="bg-2"
              className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-white transition-colors duration-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* هاله سبز کمرنگ کل اسلاید */}
              <div 
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(255, 255, 255, 0) 80%)"
                }}
              />
              {/* هاله‌های سبز محو در اطراف */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-3xl"
              />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* محتوای اسلایدر با ارتفاع ثابت - یکسان برای هر دو اسلاید */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] py-1 sm:py-2">
          <div className="w-full flex items-center justify-center flex-1">
            <AnimatePresence mode="wait">
              {currentSlide === 0 ? (
                /* صفحه اول: تایمر و عنوان لیگ نخبگان */
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex flex-col items-center gap-3 sm:gap-4"
                >
                  <div className="w-full text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-10 bg-[#F97316]/15 blur-3xl rounded-full pointer-events-none animate-pulse" />

                    <span 
                      className="relative z-10 text-xl sm:text-5xl font-black tracking-wider uppercase font-sans drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] block"
                      style={{
                        background: "linear-gradient(90deg, #F97316 0%, #FBBF24 50%, #FDE68A 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ELITE SCIENCE LEAGUE
                    </span>
                  </div>

                  {!isStarted ? (
                    <div className="w-full flex items-center justify-center gap-1.5 sm:gap-4">
                      <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce shrink-0" />

                      <div className="flex items-center justify-center gap-1 sm:gap-3 bg-[#111318] border border-[#F97316]/35 backdrop-blur-xl px-2 py-1.5 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-[0_0_25px_rgba(17,19,24,0.8)]">
                        <CompactTimeUnit value={formatNum(timeLeft.seconds)} label="ثانیه" />
                        <span className="text-[#F97316] text-xs sm:text-base font-bold animate-pulse mb-2 sm:mb-3">:</span>
                        <CompactTimeUnit value={formatNum(timeLeft.minutes)} label="دقیقه" />
                        <span className="text-[#F97316] text-xs sm:text-base font-bold animate-pulse mb-2 sm:mb-3">:</span>
                        <CompactTimeUnit value={formatNum(timeLeft.hours)} label="ساعت" />
                        <span className="text-[#F97316] text-xs sm:text-base font-bold animate-pulse mb-2 sm:mb-3">:</span>
                        <CompactTimeUnit value={formatNum(timeLeft.days)} label="روز" />
                      </div>

                      <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce shrink-0" />
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <a
                        href="/elite-league-guide"
                        className="group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#FDE68A] text-[#050505] font-black text-xs sm:text-lg shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        <Trophy className="w-5 h-5 sm:w-6 h-5 sm:h-6 text-[#050505]" />
                        <span className="text-[10px] sm:text-lg">شروع رقابت</span>
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* صفحه دوم: ورود به سایت منتظران */
                <motion.div
                  key="slide-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex items-center justify-center"
                >
                  <a
                    href="http://montazeran-web.ir"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ورود به سایت مجموعه منتظران"
                    dir="rtl"
                    className="
                      group
                      flex items-center
                      justify-center
                      px-4 sm:px-8
                      py-2 sm:py-3
                      transition-all duration-300
                      hover:scale-[1.02]
                      gap-3 sm:gap-6
                    "
                  >
                    {/* لوگو */}
                    <motion.div
                      className="
                        relative
                        h-[70px] w-[70px]
                        shrink-0
                        transition-transform duration-300
                        group-hover:scale-105
                        sm:h-[130px] sm:w-[130px]
                        lg:h-[150px] lg:w-[150px]
                      "
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src="/image/montazeran.png"
                        alt="مجموعه منتظران"
                        fill
                        sizes="(max-width: 640px) 70px, 150px"
                        className="
                          object-contain
                          drop-shadow-[0_5px_15px_rgba(22,163,74,0.15)]
                        "
                      />
                    </motion.div>

                    {/* "مجموعه منتظران" */}
                    <motion.div 
                      className="min-w-0 text-right"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p
                        className="
                          text-base
                          font-black
                          text-[#1f3a5f]
                          sm:text-4xl
                          lg:text-5xl
                        "
                      >
                        مجموعه منتظران
                      </p>
                    </motion.div>

                    {/* آیکون درب ورود - در موبایل و دسکتاپ */}
                    <motion.div
                      className="
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        rounded-xl sm:rounded-2xl
                        border-2 border-emerald-200/60
                        bg-white/80
                        text-[#16a34a]
                        shadow-sm
                        transition-all duration-300
                        group-hover:bg-[#16a34a]
                        group-hover:text-white
                        group-hover:shadow-lg
                        group-hover:border-emerald-400
                        sm:h-[70px] sm:w-[70px]
                        lg:h-[80px] lg:w-[80px]
                      "
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-4 w-4 sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 17l5-5-5-5"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3" />
                      </svg>
                    </motion.div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* کنترل‌ها و دکمه‌های جابجایی اسلایدر */}
          <div className="flex items-center gap-3 mt-3 sm:mt-4">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                currentSlide === 0 ? "bg-[#F97316] w-4 sm:w-6" : "bg-slate-400/60"
              }`}
              aria-label="صفحه اول"
            />
            <button
              onClick={() => setCurrentSlide(1)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                currentSlide === 1 ? "bg-emerald-600 w-4 sm:w-6" : "bg-slate-400/60"
              }`}
              aria-label="صفحه دوم"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CompactTimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#0B0F17] border border-[#F97316]/20 px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl shadow-md min-w-[28px] sm:min-w-[46px]">
      <span className="text-[7px] sm:text-[10px] text-[#94A3B8] font-medium tracking-wide mb-0.5" style={{ fontFamily: "iranSans-r" }}>
        {label}
      </span>
      <span className="text-[10px] sm:text-sm font-black text-[#FDE68A] tracking-wider drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" style={{ fontFamily: "Tahoma, sans-serif" }}>
        {value}
      </span>
    </div>
  );
}