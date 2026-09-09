"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function ScrollAnimation({ 
  children, 
  delay = 0, 
  direction = "up" 
}: ScrollAnimationProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05, // شروع سریع‌تر انیمیشن
    rootMargin: "100px 0px", // پیش‌بارگذاری ۱۰۰ پیکسل قبل از رسیدن اسکرول
  });

  // کاهش میزان جابه‌جایی از ۵۰ به ۲۰ جهت جلوگیری از Reflow سنگین در Safari
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ 
        duration: 0.4, // کاهش زمان از 0.6 به 0.4 برای روانی بیشتر
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0], // استفاده از cubic-bezier بهینه
      }}
      className="transform-gpu will-change-transform" // انتقال محاسبات به GPU
    >
      {children}
    </motion.div>
  );
}