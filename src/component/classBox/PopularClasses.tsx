"use client";

import React from "react";
import Container from "@/component/Container";
import ClassCart from "./ClassCart";
import { motion } from "framer-motion";

export default function PopularClasses() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
      <Container>
        {/* هدر بخش */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10"
        >
          {/* خط‌چین بالا (حرکت از راست به چپ) */}
          <div className="flex justify-end gap-1 mb-6 pl-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + (4 - i) * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className="h-1 rounded-full bg-accent"
              />
            ))}
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            کلاس‌های پرطرفدار
          </h2>
          
          {/* خط‌چین پایین (حرکت از چپ به راست) */}
          <div className="flex justify-start gap-1 mt-6 pr-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + i * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className="h-1 rounded-full bg-accent"
              />
            ))}
          </div>
        </motion.div>

        {/* لیست کارت‌ها */}
        <div>
          <ClassCart />
        </div>
      </Container>
    </section>
  );
}