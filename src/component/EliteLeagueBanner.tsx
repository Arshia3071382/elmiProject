"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, Star } from "lucide-react";
import Image from "next/image";
import Container from "./Container";

export default function EliteLeagueBanner() {
  const targetDate = "2027-05-22T00:00:00";
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // State برای اسلایدر سه صفحه ای (۰، ۱، ۲)
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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // تغییر خودکار اسلایدر هر ۶ ثانیه (بین ۳ اسلاید)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // تابع تبدیل دقیق اعداد انگلیسی به فارسی
  const formatNum = (num: number) => {
    const str = num < 10 ? `0${num}` : num.toString();
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <Container>
      <div
        dir="rtl"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:mt-16 text-right"
      >
        {/* کانتینر اصلی بنر با ارتفاع ثابت و کنترل شده */}
        <motion.div
          className={`
          relative overflow-hidden rounded-2xl bg-[#050505] px-3 sm:px-8 text-[#F8FAFC]
          border-y sm:border
          transition-all duration-700
          ${
            currentSlide === 0
              ? "border-[#F97316]/40 shadow-[0_0_60px_rgba(249,115,22,0.18)]"
              : currentSlide === 1
              ? "border-emerald-300/50 shadow-[0_0_80px_rgba(34,197,94,0.15)]"
              : "border-amber-400/60 shadow-[0_0_80px_rgba(251,191,36,0.25)]"
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
                    background:
                      "radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(251, 191, 36, 0.08) 35%, transparent 70%)",
                  }}
                />

                <motion.div
                  animate={{
                    y: [-60, 60, -60],
                    x: [-40, 40, -40],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 left-1/4 w-48 h-48 bg-gradient-to-br from-[#F97316]/25 to-[#EF4444]/5 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    y: [50, -50, 50],
                    x: [30, -30, 30],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(255, 255, 255, 0) 80%)",
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-3xl"
                />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* پس‌زمینه اسلاید سوم (لوکس، گرم و هیجان‌انگیز برنزی-کهربایی با درخشش طلایی و سفید) */}
          <AnimatePresence mode="wait">
            {currentSlide === 2 && (
              <motion.div
                key="bg-3"
                className="absolute inset-0 pointer-events-none overflow-hidden z-0"
                style={{
                  background:
                    "linear-gradient(135deg, #2A1705 0%, #150C03 50%, #1F1002 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* نورهای متحرک و پویا جهت ایجاد هیجان */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [-20, 20, -20],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-24 left-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.1, 0.9, 1.1],
                    opacity: [0.2, 0.4, 0.2],
                    y: [-15, 15, -15],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-24 right-1/4 w-80 h-80 bg-yellow-600/15 rounded-full blur-3xl"
                />

                {/* ذرات درخشان ملایم شبیه به ستاره‌های طلایی و سفید کوچک */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      y: Math.random() * 120,
                      x: Math.random() * 1200,
                      opacity: 0.2,
                      scale: Math.random() * 0.8 + 0.5,
                    }}
                    animate={{
                      opacity: [0.2, 0.9, 0.2],
                      scale: [0.8, 1.3, 0.8],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    className="absolute w-1 h-1 bg-amber-200 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${i * 7}%`,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* بخش محتوا با ارتفاع کاملاً ثابت و یکسان در تمام حالت‌ها */}
          <div className="relative z-10 flex flex-col items-center justify-between h-[105px] sm:h-[135px] py-2 sm:py-3">
            <div className="w-full flex items-center justify-center flex-1">
              <AnimatePresence mode="wait">
                {currentSlide === 0 ? (
                  /* صفحه اول: تایمر و عنوان لیگ نخبگان */
                  <motion.div
                    key="slide-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2.5"
                  >
                    <div className="w-full text-center relative">
                      <span
                        className="relative z-10 text-base sm:text-3xl font-black tracking-wider uppercase font-sans drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] block"
                        style={{
                          background:
                            "linear-gradient(90deg, #F97316 0%, #FBBF24 50%, #FDE68A 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ELITE SCIENCE LEAGUE
                      </span>
                    </div>

                    <div className="w-full flex items-center justify-center gap-1.5 sm:gap-4">
                      <Trophy className="w-4 h-4 sm:w-7 sm:h-7 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce shrink-0" />

                      {/* باکس تایمر با چیدمان چپ‌به‌چپ (روز -> ساعت -> دقیقه -> ثانیه) */}
                      <div
                        dir="ltr"
                        className="flex items-center justify-center gap-1 sm:gap-3 bg-[#0D1117] border border-[#F97316]/40 backdrop-blur-xl px-2.5 py-1 sm:px-6 sm:py-2 rounded-xl sm:rounded-2xl shadow-[0_0_25px_rgba(17,19,24,0.9)]"
                      >
                        <CompactTimeUnit
                          value={formatNum(timeLeft.days)}
                          label="روز"
                        />
                        <span className="text-[#F97316] text-sm sm:text-lg font-black animate-pulse mb-1 sm:mb-2">
                          :
                        </span>
                        <CompactTimeUnit
                          value={formatNum(timeLeft.hours)}
                          label="ساعت"
                        />
                        <span className="text-[#F97316] text-sm sm:text-lg font-black animate-pulse mb-1 sm:mb-2">
                          :
                        </span>
                        <CompactTimeUnit
                          value={formatNum(timeLeft.minutes)}
                          label="دقیقه"
                        />
                        <span className="text-[#F97316] text-sm sm:text-lg font-black animate-pulse mb-1 sm:mb-2">
                          :
                        </span>
                        <CompactTimeUnit
                          value={formatNum(timeLeft.seconds)}
                          label="ثانیه"
                        />
                      </div>

                      <Trophy className="w-4 h-4 sm:w-7 sm:h-7 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce shrink-0" />
                    </div>
                  </motion.div>
                ) : currentSlide === 1 ? (
                  /* صفحه دوم: ورود به سایت منتظران */
                  <motion.div
                    key="slide-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex items-center justify-center"
                  >
                    <a
                      href="http://montazeran-web.ir"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="ورود به سایت مجموعه منتظران"
                      dir="rtl"
                      className="group flex items-center justify-between w-full max-w-3xl px-2 sm:px-8 py-1 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3 sm:gap-6">
                        {/* لوگو با ابعاد فیکس‌شده */}
                        <div className="relative h-[48px] w-[48px] sm:h-[75px] sm:w-[75px] shrink-0">
                          <Image
                            src="/image/montazeran.png"
                            alt="مجموعه منتظران"
                            fill
                            sizes="(max-width: 640px) 48px, 75px"
                            className="object-contain drop-shadow-[0_5px_15px_rgba(22,163,74,0.15)]"
                          />
                        </div>

                        {/* متن مجموعه منتظران */}
                        <div className="min-w-0 text-right">
                          <p className="text-base sm:text-2xl lg:text-3xl font-black text-[#1f3a5f]">
                            مجموعه منتظران
                          </p>
                        </div>
                      </div>

                      {/* آیکون درب ورود */}
                      <div className="flex h-[38px] w-[38px] sm:h-[55px] sm:w-[55px] shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-emerald-200/60 bg-white/80 text-[#16a34a] shadow-sm transition-all duration-300 group-hover:bg-[#16a34a] group-hover:text-white group-hover:shadow-lg group-hover:border-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="h-4 w-4 sm:h-6 sm:w-6"
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H3"
                          />
                        </svg>
                      </div>
                    </a>
                  </motion.div>
                ) : (
                  /* صفحه سوم: معرفی رتبه برتر (با پس‌زمینه گرم برنزی-کهربایی، پالت طلایی و سفید) */
                  <motion.div
                    key="slide-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex items-center justify-between px-2 sm:px-6"
                  >
                    <div className="flex items-center gap-3 sm:gap-5">
                      {/* تصویر عمودی رتبه برتر با قاب طلایی روشن */}
                      <div className="relative h-[65px] w-[50px] sm:h-[105px] sm:w-[80px] shrink-0 rounded-xl overflow-hidden border-2 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)] bg-[#1a0f02]">
                        <Image
                          src="/image/bartar.jpeg"
                          alt="آقای مهدی نجفی - رتبه ۶ کشوری کنکور"
                          fill
                          sizes="(max-width: 640px) 50px, 80px"
                          className="object-cover"
                        />
                      </div>

                      {/* اطلاعات رتبه برتر با متن‌های سفید و طلایی */}
                      <div className="flex flex-col justify-center text-right">
                        <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                          <span className="text-[10px] sm:text-xs font-bold text-amber-200 bg-amber-500/20 border border-amber-300/40 px-2 py-0.5 rounded-md shadow-sm">
                            افتخار مجموعه علمی منتظران
                          </span>
                          <Star className="w-3 h-3 text-amber-300 fill-amber-300 hidden sm:block" />
                        </div>

                        <h3 className="text-sm sm:text-xl lg:text-2xl font-black text-white tracking-wide">
                          آقای <span className="text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)]">مهدی نجفی</span>
                        </h3>

                        <p className="text-[11px] sm:text-sm text-slate-100 font-medium mt-0.5">
                          کسب <span className="text-amber-300 font-bold">رتبه ۶ کشوری</span> کنکور سراسری ۱۴۰۵ (رشته ریاضی)
                        </p>
                      </div>
                    </div>

                    {/* آیکون مدال با بک‌گراند و درخشش هماهنگ */}
                    <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#351e06] border border-amber-300/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0">
                      <Award className="w-6 h-6 text-amber-300" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* نقطه/نشانگرهای اسلایدر (۳ نقطه) */}
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setCurrentSlide(0)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === 0
                    ? "bg-[#F97316] w-5 sm:w-8"
                    : "bg-slate-400/60 w-1.5"
                }`}
                aria-label="صفحه اول"
              />
              <button
                onClick={() => setCurrentSlide(1)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === 1
                    ? "bg-emerald-600 w-5 sm:w-8"
                    : "bg-slate-400/60 w-1.5"
                }`}
                aria-label="صفحه دوم"
              />
              <button
                onClick={() => setCurrentSlide(2)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === 2
                    ? "bg-amber-300 w-5 sm:w-8"
                    : "bg-slate-400/60 w-1.5"
                }`}
                aria-label="صفحه سوم"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}

function CompactTimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#030712] border border-[#F97316]/30 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl shadow-inner min-w-[30px] sm:min-w-[48px]">
      <span className="text-[8px] sm:text-[11px] text-[#94A3B8] font-semibold tracking-wider mb-0.5">
        {label}
      </span>
      <span
        className="text-xs sm:text-base font-black text-[#FEF08A] tracking-wider drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}