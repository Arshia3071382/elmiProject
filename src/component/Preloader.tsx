"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PreloaderRocketProps {
  onComplete?: () => void;
}

export default function PreloaderRocket({ onComplete }: PreloaderRocketProps) {
  const [loading, setLoading] = useState(false); // پیش‌فرض روی false تا در SSR مشکلی پیش نیاد
  const [count, setCount] = useState<number | string>(3);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    // بررسی اینکه آیا کاربر قبلاً در این سشن سایت را باز کرده است یا خیر
    const hasVisited = sessionStorage.getItem("hasVisitedBefore");
    
    if (hasVisited) {
      setLoading(false);
      if (onComplete) onComplete();
      return;
    }

    // اگر اولین بار است، لودر فعال شود و در سشن ثبت گردد
    setLoading(true);
    sessionStorage.setItem("hasVisitedBefore", "true");

    // شمارش معکوس 3، 2، 1
    const countInterval = setInterval(() => {
      setCount((prev) => {
        if (typeof prev === "number" && prev > 1) {
          return prev - 1;
        } else if (prev === 1) {
          return "حرکت!";
        }
        return prev;
      });
    }, 900);

    const launchTimer = setTimeout(() => {
      setIsLaunching(true);
    }, 2800);

    const completeTimer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearInterval(countInterval);
      clearTimeout(launchTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isLaunching ? { y: "-100%", opacity: [1, 1, 0] } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={{ fontFamily: "iranSans-r, sans-serif" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-800 overflow-hidden"
    >
      {/* پس‌زمینه روشن و شاداب */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38BDF8_1.5px,transparent_1.5px)] [background-size:28px_28px]"></div>

      <div className="relative flex flex-col items-center justify-center z-10">
        <motion.div
          animate={
            isLaunching
              ? { y: -700, scale: 1.1, rotate: [0, -2, 2, 0] }
              : {
                  y: [0, -10, 0],
                  x: [0, -2, 2, -2, 2, 0],
                  rotate: [0, -1, 1, -1, 1, 0],
                }
          }
          transition={
            isLaunching
              ? { duration: 0.7, ease: "easeIn" }
              : { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative flex flex-col items-center mb-6"
        >
          <div className="w-40 h-40 relative flex items-center justify-center">
            <img
              src="/image/preloader.png"
              alt="Rocket"
              className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(37,99,235,0.2)]"
            />
          </div>

          <motion.div
            animate={
              isLaunching
                ? { scaleY: 3.5, scaleX: 2, opacity: 1 }
                : { scaleY: [1, 1.6, 1], scaleX: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }
            }
            transition={isLaunching ? { duration: 0.3 } : { duration: 0.15, repeat: Infinity }}
            className="absolute -bottom-6 w-14 h-24 bg-gradient-to-t from-orange-500 via-sky-400 to-yellow-300 rounded-full blur-[8px] -z-10 shadow-[0_0_40px_#38BDF8]"
          />
        </motion.div>

        {/* سکوی پرتاب */}
        <div className="w-56 h-3.5 bg-sky-100 border border-sky-200 rounded-full shadow-inner mb-8 flex items-center justify-center">
          <div className="w-36 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
        </div>

        {/* متن و اعداد */}
        <div className="flex flex-col items-center text-center">
          <span 
            style={{ fontFamily: "iranBold, sans-serif" }}
            className="text-xl text-sky-600 tracking-wide mb-1"
          >
            آماده پرتاب
          </span>

          <motion.div
            key={String(count)}
            initial={{ scale: 0.4, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ fontFamily: "iranBold, sans-serif" }}
            className="text-7xl font-black aurora-text drop-shadow-md min-h-[90px] flex items-center justify-center my-1"
          >
            {count}
          </motion.div>

          {/* پروگرس بار ۳ ثانیه‌ای */}
          <div className="w-64 h-3 bg-sky-50 rounded-full border border-sky-100 overflow-hidden mt-4 p-0.5 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3 tracking-wider font-medium">
            سفر به دنیای شگفت‌انگیز علم و فناوری 🚀
          </p>
        </div>
      </div>
    </motion.div>
  );
}