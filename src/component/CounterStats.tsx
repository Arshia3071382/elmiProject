"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate, motion } from "framer-motion";
import { Users, GraduationCap, Laptop, BookOpen } from "lucide-react";
import Container from "./Container";

// Helper
const toPersianNum = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

// Counter Item
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(toPersianNum(0));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(toPersianNum(Math.round(latest)));
        },
      });
      return controls.stop;
    }
  }, [isInView, target, count]);

  return (
    <div
      ref={ref}
      className="bg-white p-6 rounded-3xl border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center group"
    >
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>

      {/* Number */}
      <div
        className="text-5xl font-black mb-3 text-slate-800 tracking-tight"
        style={{ fontFamily: "iranBold" }}
      >
        {prefix}
        {displayValue}
      </div>

      {/* Label */}
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

// Main Component
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
      <div className="my-16 mt-30">
        {/* هدر بخش (خارج از حلقه کارت‌ها قرار گرفت تا تکرار نشود) */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10"
        >
          {/* خط‌چین بالا */}
          <div className="flex justify-end gap-1 mb-6 pl-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + (4 - i) * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${
                  i === 4 ? 'bg-blue-400' : 
                  i === 3 ? 'bg-emerald-400' : 
                  i === 2 ? 'bg-cyan-400' :
                  i === 1 ? 'bg-teal-400' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
             ارقامِ ماندگار
          </h2>
          
          {/* خط‌چین پایین */}
          <div className="flex justify-start gap-1 mt-6 pr-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + i * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${
                  i === 0 ? 'bg-blue-400' : 
                  i === 1 ? 'bg-emerald-400' : 
                  i === 2 ? 'bg-cyan-400' :
                  i === 3 ? 'bg-teal-400' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* لیست کارت‌ها */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <CounterItem key={idx} {...stat} />
          ))}
        </div>
      </div>
    </Container>
  );
}