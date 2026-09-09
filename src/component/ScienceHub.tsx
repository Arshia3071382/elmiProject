"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "./Container";
import { motion } from "framer-motion";
import { 
  Compass, 
  Radio, 
  Film, 
  CalendarDays, 
  FileCheck2, 
  Users,
  ArrowUpRight
} from "lucide-react";

interface HubItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  iconBg: string;
  borderColor: string;
}

export default function ScienceHub() {
  const hubItems: HubItem[] = [
    { 
      id: 1, 
      title: "ایستگاه کنجکاوی", 
      subtitle: "جواب چالش های ذهنی شما",
      icon: <Compass className="w-6 h-6 text-blue-600" />, 
      href: "/curiosity",
      gradient: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100 group-hover:bg-blue-200",
      borderColor: "border-blue-200 group-hover:border-blue-400"
    },
    { 
      id: 2, 
      title: "پخش زنده", 
      subtitle: "لحظات علمی ناب",
      icon: <Radio className="w-6 h-6 text-emerald-600" />, 
      href: "/live",
      gradient: "from-emerald-500 to-teal-400",
      iconBg: "bg-emerald-100 group-hover:bg-emerald-200",
      borderColor: "border-emerald-200 group-hover:border-emerald-400"
    },
    { 
      id: 3, 
      title: "ویترین علمی", 
      subtitle: "فریم به فریم با علمی",
      icon: <Film className="w-6 h-6 text-sky-600" />, 
      href: "/showcase",
      gradient: "from-sky-500 to-blue-400",
      iconBg: "bg-sky-100 group-hover:bg-sky-200",
      borderColor: "border-sky-200 group-hover:border-sky-400"
    },
    { 
      id: 4, 
      title: "روزشمار ", 
      subtitle: "رویدادهای پیش رو",
      icon: <CalendarDays className="w-6 h-6 text-teal-600" />, 
      href: "/calendar",
      gradient: "from-teal-500 to-emerald-400",
      iconBg: "bg-teal-100 group-hover:bg-teal-200",
      borderColor: "border-teal-200 group-hover:border-teal-400"
    },
    { 
      id: 5, 
      title: "آزمون جامع", 
      subtitle: "سنجش توانمندی",
      icon: <FileCheck2 className="w-6 h-6 text-indigo-600" />, 
      href: "/under-construction",
      gradient: "from-indigo-500 to-sky-400",
      iconBg: "bg-indigo-100 group-hover:bg-indigo-200",
      borderColor: "border-indigo-200 group-hover:border-indigo-400"
    },
    { 
      id: 6, 
      title: "رادیو علمی", 
      subtitle: "انگیزشی و علمی",
      icon: <Users className="w-6 h-6 text-cyan-600" />, 
      href: "/podcasts",
      gradient: "from-cyan-500 to-teal-400",
      iconBg: "bg-cyan-100 group-hover:bg-cyan-200",
      borderColor: "border-cyan-200 group-hover:border-cyan-400"
    },
  ];

  return (
    <Container>
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
        {/* المان‌های پس‌زمینه ثابت و سبک (بدون animate-pulse مداوم) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/15 rounded-full blur-2xl transform-gpu" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/15 rounded-full blur-2xl transform-gpu" />
        </div>

        {/* هدر بخش */}
        <div className="w-full max-w-3xl mx-auto mb-12 sm:mb-16 text-center relative z-10 transform-gpu">
          <div className="flex justify-start gap-1 mb-4 pr-0">
            <div className="h-1 w-8 rounded-full bg-blue-400" />
            <div className="h-1 w-12 rounded-full bg-emerald-400" />
            <div className="h-1 w-16 rounded-full bg-cyan-400" />
            <div className="h-1 w-20 rounded-full bg-teal-400" />
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            قطب‌نمای علمی
          </h2>

          <div className="flex justify-end gap-1 mt-4 pl-0">
            <div className="h-1 w-20 rounded-full bg-teal-400" />
            <div className="h-1 w-16 rounded-full bg-cyan-400" />
            <div className="h-1 w-12 rounded-full bg-emerald-400" />
            <div className="h-1 w-8 rounded-full bg-blue-400" />
          </div>
        </div>

        {/* گرید ریسپانسیو کارت‌ها */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 relative z-10">
          {hubItems.map((item) => (
            <ScienceCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </Container>
  );
}

function ScienceCard({ item }: { item: HubItem }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="h-full transform-gpu">
      <Link 
        href={item.href} 
        className="block h-full"
        onClick={() => setIsClicked(true)}
      >
        <div 
          className={`group relative flex flex-col items-center justify-between p-4 sm:p-8 bg-white border-2 ${item.borderColor} rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-center overflow-hidden h-full active:scale-98`}
        >
          {/* محتوای اصلی کارت */}
          <div className="w-full flex flex-col items-center relative z-10">
            {/* آیکون */}
            <motion.div
              animate={isClicked ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onAnimationComplete={() => setIsClicked(false)}
              className={`mb-3 sm:mb-4 p-3 sm:p-4 ${item.iconBg} rounded-2xl border-2 ${item.borderColor} transition-colors duration-300 flex items-center justify-center`}
            >
              {item.icon}
            </motion.div>

            {/* بخش متن‌ها */}
            <div className="w-full">
              <h3 className="text-xs sm:text-base font-[iranBold] text-primary mb-1 antialiased">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mb-3 sm:mb-4 antialiased">
                {item.subtitle}
              </p>
            </div>
          </div>

          {/* دکمه و فلش */}
          <div className="w-full mt-auto relative z-10">
            <div className="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium transition-transform duration-300 group-hover:translate-x-1">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${item.gradient} font-[iranBold] antialiased`}>
                بزن بریم
              </span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
            </div>
          </div>

          {/* خط تزئینی پایین کارت با ترنزیشن CSS استاندارد */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      </Link>
    </div>
  );
}