"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TimelineHeader() {
  return (
    <div className="max-w-5xl mx-auto text-center pt-20 pb-16 px-6 relative z-10">
      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 bg-slate-800/5 border border-slate-800/10 px-4 py-2 rounded-full text-slate-800 text-sm mb-6 font-bold"
      >
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span>هوالمحبوب</span>
      </motion.div>

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-3xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight"
      >
        داستان یک نقشه گنج علمی
      </motion.h1>

      {/* Covenant text */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto border-r-4 border-blue-600 pr-4 bg-white p-5 rounded-l-2xl shadow-sm border border-slate-200"
      >
        «آغاز گام‌های ما در این مسیر پرپیچ‌وخم، با توسل و عهدی قلبی به پیشگاه{" "}
        <span className="text-blue-600 font-bold">حضرت ولی‌عصر (عج)</span> گره
        خورد؛ به این امید که هر قدممان، نوری در مسیر رشد و تعالی جوانان این مرز
        و بوم باشد.»
      </motion.p>
    </div>
  );
}