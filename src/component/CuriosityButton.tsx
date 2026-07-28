"use client";

import Link from "next/link";
import Container from "@/component/Container";
import { Sparkles, Compass, ArrowLeft } from "lucide-react";

export default function CuriosityButton() {
  return (
    <section className="py-6 dir-rtl font-[iranSans-r]">
      <Container>
        <div className="flex  justify-center">
          <Link
            href="/curiosity"
            className="group relative overflow-hidden flex flex-col sm:flex-row-reverse items-center justify-between  w-full max-w-2xl p-5 sm:p-6 bg-gradient-to-l from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl hover:brightness-110 transition-all duration-300 gap-4"
          >
            {/* لایه درخشش ملایم هنگام هاور */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />

            {/* متن و آیکون (سمت راست) */}
            <div className="relative z-10 flex flex-row-reverse justify-start items-center gap-3.5 sm:gap-4  w-full sm:w-auto">
              <div className="p-2.5 sm:p-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl text-white group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex flex-row-reverse items-center gap-1.5 text-accent text-[11px] sm:text-xs font-[iranBold] mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>چالش‌های فکری</span>
                </div>
                <h2 className="text-base sm:text-xl font-[iranBold] text-text-invert tracking-tight">
                  ایستگاه کنجکاوی
                </h2>
              </div>
            </div>

            {/* دکمه اکشن (سمت چپ) */}
            <div className="relative z-10 flex items-center justify-center gap-2 bg-surface text-primary px-5 py-2.5 rounded-xl sm:rounded-2xl font-[iranBold] text-xs sm:text-sm shadow-md group-hover:bg-accent group-hover:text-white transition-all duration-300 w-full sm:w-auto shrink-0">
              <span>مشاهده موضوعات</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}