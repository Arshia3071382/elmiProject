"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate, motion } from "framer-motion";
import { Users, GraduationCap, Laptop, BookOpen } from "lucide-react";
import Container from "./Container";

// Helper سبک برای تبدیل اعداد به فارسی
const toPersianNum = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

interface CounterItemProps {
  target: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
  bgColor: string;
  prefix?: string;
}

function CounterItem({
  target,
  label,
  suffix = "",
  icon,
  bgColor,
  prefix = "",
}: CounterItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(toPersianNum(0));
  const lastRoundedValue = useRef(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1], // منحنی سرعت بسیار نرم
        onUpdate: (latest) => {
          const rounded = Math.round(latest);
          // بهینه‌سازی کلیدی: جلوگیری از ری‌رندرهای تکراری در یک فریم
          if (rounded !== lastRoundedValue.current) {
            lastRoundedValue.current = rounded;
            setDisplayValue(toPersianNum(rounded));
          }
        },
      });
      return controls.stop;
    }
  }, [isInView, target, count]);

  return (
    <div
      ref={ref}
      className="bg-white p-6 rounded-3xl border border-gray-100 transition-transform transition-shadow duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center group transform-gpu"
    >
      {/* آیکون */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>

      {/* عدد شمارنده */}
      <div
        className="text-5xl font-black mb-3 text-slate-800 tracking-tight flex items-center justify-center gap-1"
        dir="ltr"
        style={{ fontFamily: "iranBold" }}
      >
        {prefix && <span>{prefix}</span>}
        <span>{displayValue}</span>
      </div>

      {/* توضیحات */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-sm font-medium text-slate-400 min-h-[22px]"
          style={{ fontFamily: "iranSans-r" }}
        >
          {suffix}
        </span>
        <p
          className="text-base font-bold text-slate-700"
          style={{ fontFamily: "iranBold" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default function CounterStats() {
  const stats = [
    {
      target: 800,
      label: "دانش آموختگان",
      prefix: "+",
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      bgColor: "#EFF6FF",
    },
    {
      target: 420,
      label: "کلاس‌های حضوری",
      suffix: "جلسه",
      icon: <Users className="w-8 h-8 text-green-600" />,
      bgColor: "#F0FDF4",
    },
    {
      target: 70,
      label: "دوره‌های مجازی",
      suffix: "جلسه",
      icon: <Laptop className="w-8 h-8 text-cyan-600" />,
      bgColor: "#ECFEFF",
    },
    {
      target: 25,
      label: "تعداد اساتید مجموعه",
      suffix: "",
      icon: <BookOpen className="w-8 h-8 text-amber-600" />,
      bgColor: "#FEF3C7",
    },
  ];

  return (
    <Container>
      <div className="my-12 sm:my-20">
        {/* هدر بخش بهینه‌شده */}
        <div className="w-full max-w-3xl mx-auto mb-12 text-center relative z-10 transform-gpu">
          <div className="flex justify-start gap-1 mb-4 pr-0">
            <div className="h-1 w-8 rounded-full bg-blue-400" />
            <div className="h-1 w-12 rounded-full bg-emerald-400" />
            <div className="h-1 w-16 rounded-full bg-cyan-400" />
            <div className="h-1 w-20 rounded-full bg-teal-400" />
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            ارقامِ ماندگار
          </h2>

          <div className="flex justify-end gap-1 mt-4 pl-0">
            <div className="h-1 w-20 rounded-full bg-teal-400" />
            <div className="h-1 w-16 rounded-full bg-cyan-400" />
            <div className="h-1 w-12 rounded-full bg-emerald-400" />
            <div className="h-1 w-8 rounded-full bg-blue-400" />
          </div>
        </div>

        {/* لیست کارت‌ها */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <CounterItem key={idx} {...stat} />
          ))}
        </div>
      </div>
    </Container>
  );
}