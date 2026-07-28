"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, GraduationCap, Laptop, BookOpen } from "lucide-react";
import Container from "./Container";

// Convert numbers to Persian strings
const toPersianNum = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

interface CounterItemProps {
  target: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor?: string;
}

function CounterItem({ target, label, suffix = "", icon, bgColor }: CounterItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(toPersianNum(0) + suffix);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(toPersianNum(Math.round(latest)) + suffix);
        }
      });
      return controls.stop;
    }
  }, [isInView, target, count, suffix]);

  return (
    <div 
      ref={ref}
      className="bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center group"
      style={{ borderColor: "#E5E7EB" }}
    >
      {/* Icon container */}
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>

      {/* Output number */}
      <span 
        className="text-3xl font-bold mb-1 tracking-tight"
        style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
      >
        {displayValue}
      </span>

      {/* Stat item label */}
      <p 
        className="text-sm font-medium"
        style={{ color: "#475569", fontFamily: "iranSans-r" }}
      >
        {label}
      </p>
    </div>
  );
}

export default function CounterStats() {
  const stats = [
    {
      target: 1000,
      label: "دانش آموختگان",
      suffix: "+",
      icon: <GraduationCap className="w-7 h-7" style={{ color: "#2563EB" }} />,
      bgColor: "#EFF6FF",
    },
    {
      target: 420,
      label: "کلاس‌های حضوری",
      suffix: " جلسه",
      icon: <Users className="w-7 h-7" style={{ color: "#22C55E" }} />,
      bgColor: "#F0FDF4",
    },
    {
      target: 100,
      label: "دوره‌های مجازی",
      suffix: " جلسه",
      icon: <Laptop className="w-7 h-7" style={{ color: "#06B6D4" }} />,
      bgColor: "#ECFEFF",
    },
    {
      target: 35,
      label: "تعداد اساتید مجموعه",
      suffix: "",
      icon: <BookOpen className="w-7 h-7" style={{ color: "#F59E0B" }} />,
      bgColor: "#FEF3C7",
    },
  ];

  return (
    <Container>
      
        <div className="grid mt-10 grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
          {stats.map((stat, idx) => (
            <CounterItem 
              key={idx} 
              target={stat.target}
              label={stat.label}
              suffix={stat.suffix}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
      
    </Container>
  );
}