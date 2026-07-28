"use client";

import React from "react";
import Container from "@/component/Container";
import ClassCart from "./ClassCart";
import { motion } from "framer-motion";

export default function PopularClasses() {
  // Colors for the pins - Blue and Green spectrum
  const pinColors = [
    'bg-blue-400',
    'bg-emerald-400', 
    'bg-cyan-400',
    'bg-teal-400',
    'bg-indigo-400'
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
      <Container>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10"
        >
          {/* Top Pins Line (Right to Left) */}
          <div className="flex justify-end gap-1 mb-6 pl-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`top-${i}`}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + (4 - i) * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${pinColors[i]}`}
              />
            ))}
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            کلاس‌های پرطرفدار
          </h2>
          
          {/* Bottom Pins Line (Left to Right) */}
          <div className="flex justify-start gap-1 mt-6 pr-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`bottom-${i}`}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + i * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${pinColors[i]}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Cards List - Responsive Grid: بدون max-w محدود کننده */}
        <div className="w-full">
          <ClassCart />
        </div>
      </Container>
    </section>
  );
}