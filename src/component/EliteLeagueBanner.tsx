"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft } from "lucide-react";

export default function EliteLeagueBanner() {
  // تاریخ شروع رقابت: ۱ مهر ۱۴۰۵
  const targetDate = "2026-09-23T00:00:00";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(false);

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

  // تابع تبدیل دقیق اعداد انگلیسی به فارسی برای تمام حالت‌ها (حتی زیر ۱۰ ثانیه)
  const formatNum = (num: number) => {
    const str = num < 10 ? `0${num}` : num.toString();
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div className="w-full my-8 sm:mt-30 ">
      {/* بنر با پالت رنگی نهایی لیگ نخبگان */}
      <div className="relative overflow-hidden rounded-none bg-[#050505] border-y border-[#F97316]/40 shadow-[0_0_60px_rgba(249,115,22,0.18)] py-8 px-4 sm:px-12 text-[#F8FAFC]">
        
        {/* پس‌زمینه فضا، نورهای شعله‌ور و بارش آتش */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(251, 191, 36, 0.08) 35%, transparent 70%"
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
        </div>

        {/* محتوای اصلی بنر */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          
          {/* ردیف بالا: تایتل اصلی ELITE SCIENCE LEAGUE */}
          <div className="w-full text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-10 bg-[#F97316]/15 blur-3xl rounded-full pointer-events-none animate-pulse" />
            
            <span 
              className="relative z-10 text-2xl sm:text-5xl font-black tracking-wider uppercase font-sans drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] block"
              style={{
                background: "linear-gradient(90deg, #F97316 0%, #FBBF24 50%, #FDE68A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ELITE SCIENCE LEAGUE
            </span>
          </div>

          {/* ردیف وسط: تایمر یا دکمه شروع */}
          {!isStarted ? (
            <div className="w-full flex items-center justify-center gap-2 sm:gap-4">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce shrink-0" />

              <div className="flex items-center justify-center gap-1.5 sm:gap-3 bg-[#111318] border border-[#F97316]/30 backdrop-blur-xl px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl shadow-[0_0_25px_rgba(17,19,24,0.8)]">
                <CompactTimeUnit value={formatNum(timeLeft.seconds)} label="ثانیه" />
                <span className="text-[#F97316] text-sm sm:text-base font-bold animate-pulse mb-3">:</span>
                <CompactTimeUnit value={formatNum(timeLeft.minutes)} label="دقیقه" />
                <span className="text-[#F97316] text-sm sm:text-base font-bold animate-pulse mb-3">:</span>
                <CompactTimeUnit value={formatNum(timeLeft.hours)} label="ساعت" />
                <span className="text-[#F97316] text-sm sm:text-base font-bold animate-pulse mb-3">:</span>
                <CompactTimeUnit value={formatNum(timeLeft.days)} label="روز" />
              </div>

              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce shrink-0" />
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <a
                href="/elite-league-guide"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#FDE68A] text-[#050505] font-black text-sm sm:text-lg shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Trophy className="w-6 h-6 text-[#050505]" />
                <span>شروع رقابت (راهنمای لیگ نخبگان)</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function CompactTimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#0B0F17] border border-[#F97316]/20 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl shadow-md min-w-[38px] sm:min-w-[46px]">
      <span className="text-[9px] sm:text-[10px] text-[#94A3B8] font-medium tracking-wide mb-0.5" style={{ fontFamily: "iranSans-r" }}>
        {label}
      </span>
      {/* استفاده از فونت استاندارد بی‌سر و صدا برای نمایش کاملاً واضح اعداد فارسی */}
      <span className="text-xs sm:text-sm font-black text-[#FDE68A] tracking-wider drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" style={{ fontFamily: "Tahoma, sans-serif" }}>
        {value}
      </span>
    </div>
  );
}