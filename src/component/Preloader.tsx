"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PreloaderRocketProps {
  onComplete?: () => void;
}

export default function PreloaderRocket({ onComplete }: PreloaderRocketProps) {
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hasSeenPreloader");
    }
    return true;
  });

  const [count, setCount] = useState<number | string>(3);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (onComplete) onComplete();
      return;
    }

    const timer1 = setTimeout(() => setCount(2), 1000);
    const timer2 = setTimeout(() => setCount(1), 2000);

    const timer3 = setTimeout(() => {
      setCount("حرکت!");
      setIsLaunching(true);
    }, 3000);

    const completeTimer = setTimeout(() => {
      sessionStorage.setItem("hasSeenPreloader", "true");
      setLoading(false);
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [loading, onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="rocket-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          /* 
            اصلاحات مخصوص iOS:
            ۱. z-[9999999] جهت اطمینان از بالاترین لایه
            ۲. style transform translateZ جهت فعال‌سازی لایه GPU مستقل در Safari/Chrome iOS
          */
          className="fixed inset-0 z-[9999999] flex flex-col items-center justify-center bg-white text-slate-800 overflow-hidden transform-gpu will-change-transform isolate"
          style={{
            transform: "translate3d(0, 0, 9999px)",
            WebkitTransform: "translate3d(0, 0, 9999px)",
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38BDF8_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center z-10 transform-gpu">
            {/* موشک و آتش */}
            <motion.div
              animate={
                isLaunching
                  ? { y: -700, scale: 1.1 }
                  : { y: [0, -10, 0], x: [0, -2, 2, -2, 2, 0] }
              }
              transition={
                isLaunching
                  ? { duration: 0.5, ease: "easeIn" }
                  : { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative flex flex-col items-center mb-6 transform-gpu will-change-transform"
            >
              <div className="w-40 h-40 relative flex items-center justify-center">
                <Image
                  src="/image/preloader.png"
                  alt="Rocket"
                  width={160}
                  height={160}
                  priority
                  className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(37,99,235,0.2)] select-none"
                />
              </div>

              <motion.div
                animate={
                  isLaunching
                    ? { scaleY: 3.5, scaleX: 2, opacity: 1 }
                    : { scaleY: [1, 1.6, 1], scaleX: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }
                }
                transition={isLaunching ? { duration: 0.3 } : { duration: 0.15, repeat: Infinity }}
                className="absolute -bottom-6 w-14 h-24 bg-gradient-to-t from-orange-500 via-sky-400 to-yellow-300 rounded-full blur-[8px] -z-10 shadow-[0_0_40px_#38BDF8] transform-gpu"
              />
            </motion.div>

            <div className="w-56 h-3.5 bg-sky-100 border border-sky-200 rounded-full shadow-inner mb-8 flex items-center justify-center">
              <div className="w-36 h-1.5 bg-sky-500 rounded-full animate-pulse" />
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="text-xl text-sky-600 font-bold tracking-wide mb-1">
                آماده پرتاب
              </span>

              <motion.div
                key={String(count)}
                initial={{ scale: 0.4, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-7xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(168,85,247,0.25)] min-h-[90px] flex items-center justify-center my-1 transform-gpu"
              >
                {count}
              </motion.div>

              <div className="w-64 h-3 bg-sky-50 rounded-full border border-sky-100 overflow-hidden mt-4 p-0.5 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full origin-left transform-gpu"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </div>

              <p className="text-xs text-slate-500 mt-3 tracking-wider font-medium">
                سفر به دنیای شگفت‌انگیز علم و فناوری 🚀
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}