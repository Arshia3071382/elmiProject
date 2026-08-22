"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Rocket, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";

interface HigherLowerStudent {
  name: string;
  score: number;
}

interface RankRadarProps {
  rank: number;
  totalStudents: number;
  score: number;
  higherStudent?: HigherLowerStudent | null;
  lowerStudent?: HigherLowerStudent | null;
}

const toPersianDigits = (n: number | string): string => {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

export default function RankRadarCard({
  rank,
  totalStudents,
  score,
  higherStudent,
  lowerStudent,
}: RankRadarProps) {
  const higherRankNum = Math.max(1, rank - 1);
  const lowerRankNum = rank + 1;

  const hasHigher = Boolean(higherStudent);
  const hasLower = Boolean(lowerStudent);

  const higherName = higherStudent?.name || "";
  const higherScore = higherStudent?.score || 0;

  const lowerName = lowerStudent?.name || "";
  const lowerScore = lowerStudent?.score || 0;

  const diffToHigher = hasHigher ? Math.max(0, higherStudent!.score - score) : 0;
  const diffToLower = hasLower ? Math.max(0, score - lowerStudent!.score) : 0;

  return (
    <div
      dir="rtl"
      className="w-full max-w-5xl mx-auto rounded-3xl p-4 sm:p-8 text-slate-800 font-[iranBold] relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
    >
      {/* هدر اصلی */}
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white">
          <Trophy className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide">
          جایگاه شما در جدول
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-[iranSans-r] mt-1">
          مسیرتان را تا قله ادامه دهید!
        </p>
      </div>

      {/* ساختار ریسپانسیو: در موبایل عمودی و در دسکتاپ افقی */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-6 items-center my-4 sm:my-6 relative z-10">
        
        {/* 1. بالاتر از شما (رقیب پیشتاز یا حالت بدون رقیب بالا) */}
        <div className="w-full relative flex flex-row md:flex-col items-center justify-between md:justify-center bg-purple-900/[0.03] hover:bg-purple-900/[0.06] transition-all border border-purple-200/60 rounded-2xl md:rounded-3xl p-3.5 sm:p-5 text-right md:text-center shadow-sm group gap-3 order-1 md:order-none">
          {hasHigher ? (
            <>
              <div className="absolute top-2 left-2 md:top-3 md:right-3 text-purple-600 hidden md:block">
                <Rocket className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-3 md:flex-col">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col items-center justify-center shadow-lg shadow-purple-500/25 shrink-0 ring-2 md:ring-4 ring-purple-100">
                  <span className="text-base md:text-xl font-black font-mono leading-none">{toPersianDigits(higherRankNum)}</span>
                  <span className="text-[8px] md:text-[9px] text-purple-200 font-[iranSans-r] mt-0.5">رتبه</span>
                </div>
                <div className="md:mt-2">
                  <span className="text-[10px] md:text-[11px] text-purple-600 font-[iranSans-r] font-bold block mb-0.5">بالاتر از شما</span>
                  <span className="text-xs md:text-sm font-extrabold text-slate-800 block truncate max-w-[130px] sm:max-w-[180px] md:max-w-[200px]">{higherName}</span>
                </div>
              </div>
              <div className="text-left md:text-center md:mt-2 shrink-0">
                <span className="text-base sm:text-lg md:text-xl font-black font-mono text-purple-700 block">{toPersianDigits(higherScore)}</span>
                <span className="text-[9px] md:text-[10px] text-slate-400 font-[iranSans-r] block">امتیاز</span>
              </div>
            </>
          ) : (
            <div className="w-full py-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-purple-900 block font-[iranBold]">
                کارت عالیه ، رقیب نداری
              </span>
            </div>
          )}
        </div>

        {/* 2. جایگاه شما */}
        <div className="w-full relative flex flex-row md:flex-col items-center justify-between md:justify-center bg-gradient-to-r md:bg-gradient-to-b from-amber-500/10 via-amber-400/5 to-transparent border-2 border-amber-400/60 rounded-2xl md:rounded-3xl p-4 sm:p-6 text-right md:text-center shadow-md backdrop-blur-md gap-3 order-2 md:order-none">
          <div className="absolute top-2 left-2 md:top-3 md:right-3 text-amber-500 hidden md:block">⭐</div>

          <div className="flex items-center gap-3 md:flex-col">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="absolute w-14 h-14 md:w-20 md:h-20 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
              <div className="absolute w-18 h-18 md:w-24 md:h-24 rounded-full bg-amber-400/20 animate-pulse pointer-events-none" />
              
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 text-white flex flex-col items-center justify-center shadow-xl shadow-amber-500/40 border-2 md:border-4 border-white"
              >
                <span className="text-lg md:text-2xl font-black font-mono leading-none">{toPersianDigits(rank)}</span>
                <span className="text-[8px] md:text-[10px] text-amber-100 font-[iranSans-r] mt-0.5">رتبه</span>
              </motion.div>
            </div>

            <div className="md:mt-2">
              <span className="text-[10px] md:text-xs text-amber-700 font-[iranSans-r] font-bold block mb-0.5">جایگاه شما ⭐</span>
              <span className="text-sm md:text-base font-extrabold text-slate-900 block">شما</span>
            </div>
          </div>

          <div className="text-left md:text-center md:mt-2 shrink-0">
            <span className="text-lg sm:text-xl md:text-2xl font-black font-mono text-amber-600 block">{toPersianDigits(score)}</span>
            <span className="text-[9px] md:text-[10px] text-slate-400 font-[iranSans-r] block">امتیاز</span>
          </div>
        </div>

        {/* 3. پایین‌تر از شما (تعقیب‌کننده یا حالت بدون رقیب پایین) */}
        <div className="w-full relative flex flex-row md:flex-col items-center justify-between md:justify-center bg-emerald-900/[0.03] hover:bg-emerald-900/[0.06] transition-all border border-emerald-200/60 rounded-2xl md:rounded-3xl p-3.5 sm:p-5 text-right md:text-center shadow-sm group gap-3 order-3 md:order-none">
          {hasLower ? (
            <>
              <div className="absolute top-2 left-2 md:top-3 md:right-3 text-emerald-600 hidden md:block">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-3 md:flex-col">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0 ring-2 md:ring-4 ring-emerald-100">
                  <span className="text-base md:text-xl font-black font-mono leading-none">{toPersianDigits(lowerRankNum)}</span>
                  <span className="text-[8px] md:text-[9px] text-emerald-200 font-[iranSans-r] mt-0.5">رتبه</span>
                </div>
                <div className="md:mt-2">
                  <span className="text-[10px] md:text-[11px] text-emerald-600 font-[iranSans-r] font-bold block mb-0.5">پایین‌تر از شما</span>
                  <span className="text-xs md:text-sm font-extrabold text-slate-800 block truncate max-w-[130px] sm:max-w-[180px] md:max-w-[200px]">{lowerName}</span>
                </div>
              </div>
              <div className="text-left md:text-center md:mt-2 shrink-0">
                <span className="text-base sm:text-lg md:text-xl font-black font-mono text-emerald-700 block">{toPersianDigits(lowerScore)}</span>
                <span className="text-[9px] md:text-[10px] text-slate-400 font-[iranSans-r] block">امتیاز</span>
              </div>
            </>
          ) : (
            <div className="w-full py-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-900 block font-[iranBold]">
                دانش‌آموزی در تعقیب جایگاه شما نیست
              </span>
            </div>
          )}
        </div>

      </div>

      {/* بخش پایین: کارت‌های اطلاعات فاصله (فقط در صورت وجود رقیب نمایش داده می‌شوند) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 relative z-10">
        
        {/* فاصله تا رتبه بالاتر */}
        {hasHigher && (
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-purple-200 font-[iranSans-r] block mb-1">
                فاصله تا رتبه {toPersianDigits(higherRankNum)}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-purple-300">{toPersianDigits(diffToHigher)}</span>
                <span className="text-[11px] sm:text-xs text-purple-200 font-[iranSans-r]">امتیاز تا سبقت!</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-300 shrink-0">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        )}

        {/* فاصله امن تا رتبه پایین‌تر */}
        {hasLower && (
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-emerald-200 font-[iranSans-r] block mb-1">
                فاصله امن تا رتبه {toPersianDigits(lowerRankNum)}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">{toPersianDigits(diffToLower)}</span>
                <span className="text-[11px] sm:text-xs text-emerald-200 font-[iranSans-r]">امتیاز جلوتر هستید!</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        )}

      </div>

      {/* فوتر انگیزشی */}
      <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200/80 text-[11px] sm:text-xs text-slate-500 font-[iranSans-r]">
        🏔️ هر امتیاز شما را یک قدم به قله نزدیک‌تر می‌کند!
      </div>
    </div>
  );
}