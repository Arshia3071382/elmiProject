"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Rocket, Trophy, ArrowLeft } from "lucide-react";

export default function PuzzleActionSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 dir-rtl bg-[var(--color-bg)] overflow-hidden" dir="rtl">
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* هدر بخش */}
        <div className="text-center mb-12 sm:mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] mb-3 tracking-tight"
          >
            قدم بعدی شما چیست؟
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed"
          >
            یکی از مسیرهای زیر را انتخاب کنید و بیشتر با مجموعه و خدمات ما آشنا شوید.
          </motion.p>
        </div>

        {/* لیست گزینه‌ها */}
        <div className="flex flex-col gap-4">
          
          {/* دکمه اول: آشنایی با دبیران مجموعه (انواع سبز) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Link
              href="/teachers"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative block rounded-3xl p-[1.5px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)]"
            >
              <div className="absolute -inset-[100%] opacity-100 pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{
                    background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #22C55E 300deg, #16A34A 330deg, transparent 360deg)",
                  }}
                />
              </div>

              <motion.div 
                animate={{
                  backgroundColor: [
                    "rgba(240, 253, 244, 0.95)",
                    "rgba(220, 252, 231, 0.95)",
                    "rgba(187, 247, 208, 0.95)",
                    "rgba(240, 253, 244, 0.95)",
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center justify-between p-5 sm:p-7 rounded-[22px] border border-[var(--color-border)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(34,197,94,0.15)]"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-surface)] text-[var(--color-success)] border border-[var(--color-border)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-success)] transition-colors duration-200 mb-1">
                      آشنایی با دبیران 
                    </h3>
                    <p className="text-xs sm:text-sm font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)] font-normal leading-relaxed">
                      راهنمایی توسط برترین مربیان و اساتید علمی
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--color-success)] transition-colors duration-200">
                  <span className="hidden sm:inline">مشاهده دبیران</span>
                  <motion.div
                    animate={{ x: hoveredIndex === 0 ? -5 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ردیف دوتایی: تیم برهان و لیگ نخبگان */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* دکمه دوم: آشنایی با تیم برهان */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/borhan-team"
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative block rounded-3xl p-[1.5px] overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
              >
                <div className="absolute -inset-[100%] opacity-100 pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                      background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #38BDF8 300deg, #2563EB 330deg, transparent 360deg)",
                    }}
                  />
                </div>

                <motion.div 
                  animate={{
                    backgroundColor: [
                      "rgba(240, 249, 255, 0.95)",
                      "rgba(224, 242, 254, 0.95)",
                      "rgba(186, 230, 253, 0.95)",
                      "rgba(240, 249, 255, 0.95)",
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex flex-row items-center justify-between p-5 sm:p-6 rounded-[22px] border border-[var(--color-border)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(37,99,235,0.15)] h-full gap-3 flex-nowrap"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-[var(--color-surface)] text-[var(--color-secondary)] border border-[var(--color-border)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-200 mb-0.5 truncate">
                        آشنایی با تیم برهان
                      </h3>
                      <p className="text-[11px] sm:text-xs font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)] font-normal truncate">
                        مغز متفکر و توسعه‌دهندگان
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: hoveredIndex === 1 ? -4 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-secondary)] transition-colors shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>

            {/* دکمه سوم: قوانین لیگ نخبگان */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Link
                href="/league-guide"
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative block rounded-3xl p-[1.5px] overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="absolute -inset-[100%] opacity-100 pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                      background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #FACC15 300deg, #D97706 330deg, transparent 360deg)",
                    }}
                  />
                </div>

                <motion.div 
                  animate={{
                    backgroundColor: [
                      "rgba(254, 252, 232, 0.95)",
                      "rgba(254, 240, 138, 0.85)",
                      "rgba(253, 230, 138, 0.95)",
                      "rgba(254, 252, 232, 0.95)",
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex flex-row items-center justify-between p-5 sm:p-6 rounded-[22px] border border-[var(--color-border)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(217,119,6,0.15)] h-full gap-3 flex-nowrap"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-[var(--color-surface)] text-amber-600 border border-[var(--color-border)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] group-hover:text-amber-600 transition-colors duration-200 mb-0.5 truncate">
                        آشنایی با لیگ نخبگان
                      </h3>
                      <p className="text-[11px] sm:text-xs font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)] font-normal truncate">
                        ضوابط، امتیازات و رتبه‌بندی
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: hoveredIndex === 2 ? -4 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="text-[var(--color-text-secondary)] group-hover:text-amber-600 transition-colors shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}