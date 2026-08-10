"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Rocket, Trophy, ArrowLeft } from "lucide-react";

export default function PuzzleActionSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-4 dir-rtl bg-[var(--color-bg)]" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl lg:text-2xl font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] mb-2 tracking-tight"
          >
            قدم بعدی شما چیست؟
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-xs font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)] max-w-sm mx-auto"
          >
            یکی از مسیرهای زیر را انتخاب کنید و بیشتر با مجموعه آشنا شوید.
          </motion.p>
        </div>

        <div className="flex flex-col gap-3">
          
          {/* دکمه اول: آشنایی با دبیران مجموعه */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/teachers"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative block rounded-2xl p-[1px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)]"
            >
              {/* نوار دور در حال چرخش (سبز پررنگ‌تر) */}
              <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{
                    background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, rgba(22,163,74,0.9) 300deg, rgba(255,255,255,1) 330deg, transparent 360deg)",
                  }}
                />
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-emerald-100/60 border border-emerald-600/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[var(--color-surface)] group-hover:shadow-[0_8px_25px_rgba(22,163,74,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 transition-transform duration-300 group-hover:scale-110"
                  >
                    <GraduationCap className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm sm:text-base font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] group-hover:text-emerald-700 transition-colors duration-200 mb-0.5">
                      آشنایی با دبیران مجموعه
                    </h3>
                    <p className="text-xs font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)]">
                      راهنمایی توسط برترین مربیان علمی مجموعه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-secondary)] group-hover:text-emerald-700 transition-colors duration-200">
                  <span className="hidden sm:inline">مشاهده دبیران</span>
                  <motion.div
                    animate={{ x: hoveredIndex === 0 ? -4 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* دکمه دوم: آشنایی با تیم برهان */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Link
                href="/borhan-team"
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative block rounded-2xl p-[1px] overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {/* نوار دور در حال چرخش (آبی آسمانی پررنگ‌تر) */}
                <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                      background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, rgba(14,165,233,0.9) 300deg, rgba(255,255,255,1) 330deg, transparent 360deg)",
                    }}
                  />
                </div>

                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative flex flex-col justify-between p-5 rounded-2xl bg-sky-100/60 border border-sky-500/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[var(--color-surface)] group-hover:shadow-[0_8px_25px_rgba(14,165,233,0.1)] h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-100 text-sky-600 border border-sky-200 transition-transform duration-300 group-hover:scale-110"
                    >
                      <Rocket className="h-4 w-4" />
                    </motion.div>
                    <motion.div
                      animate={{ x: hoveredIndex === 1 ? -4 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="text-[var(--color-text-secondary)] group-hover:text-sky-600 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] group-hover:text-sky-600 transition-colors duration-200 mb-0.5">
                      آشنایی با تیم برهان
                    </h3>
                    <p className="text-xs font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)]">
                      مغز متفکر و توسعه‌دهندگان
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* دکمه سوم: قوانین لیگ نخبگان */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link
                href="/league-guide"
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative block rounded-2xl p-[1px] overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {/* نوار دور در حال چرخش (طلایی پررنگ‌تر) */}
                <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                      background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, rgba(217,119,6,0.9) 300deg, rgba(255,255,255,1) 330deg, transparent 360deg)",
                    }}
                  />
                </div>

                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative flex flex-col justify-between p-5 rounded-2xl bg-amber-100/60 border border-amber-600/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[var(--color-surface)] group-hover:shadow-[0_8px_25px_rgba(217,119,6,0.1)] h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 transition-transform duration-300 group-hover:scale-110"
                    >
                      <Trophy className="h-4 w-4" />
                    </motion.div>
                    <motion.div
                      animate={{ x: hoveredIndex === 2 ? -4 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="text-[var(--color-text-secondary)] group-hover:text-amber-700 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-[family-name:var(--font-iranBold)] font-bold text-[var(--color-text-primary)] group-hover:text-amber-700 transition-colors duration-200 mb-0.5">
                      آشنایی با لیگ نخبگان
                    </h3>
                    <p className="text-xs font-[family-name:var(--font-iranSans-r)] text-[var(--color-text-secondary)]">
                      ضوابط، امتیازات و رتبه‌بندی
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}