"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function TimelineHeader() {
  return (
    <div className="max-w-5xl mx-auto text-center pt-20 pb-16 px-6 relative z-10">
      {/* Top badge */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 bg-[#1F3A5F]/5 border border-[#1F3A5F]/10 px-4 py-2 rounded-full text-[#1F3A5F] text-sm mb-6 font-bold">
        <Sparkles className="w-4 h-4 text-[#2563EB]" />
        <span>هوالمحبوب</span>
      </motion.div>

      {/* Main title */}
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-3xl md:text-5xl font-black text-[#1F3A5F] mb-6 tracking-tight">
        داستان یک نقشه گنج علمی
      </motion.h1>

      {/* Covenant text */}
      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-base md:text-lg text-[#475569] leading-relaxed max-w-3xl mx-auto border-r-4 border-[#2563EB] pr-4 bg-white p-5 rounded-l-2xl shadow-sm border border-[#E5E7EB]">
        «آغاز گام‌های ما در این مسیر پرپیچ‌وخم، با توسل و عهدی قلبی به پیشگاه <span className="text-[#2563EB] font-bold">حضرت ولی‌عصر (عج)</span> گره خورد؛ به این امید که هر قدممان، نوری در مسیر رشد و تعالی جوانان این مرز و بوم باشد.»
      </motion.p>
    </div>
  );
}