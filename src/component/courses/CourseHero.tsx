"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function CourseHero() {
  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-3 mt-3">
          <GraduationCap
            className="w-10 h-10"
            style={{ color: "#2563EB" }}
          />

        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
        >
          دوره‌های آموزشی
        </h1>
        <p
          className="text-base"
          style={{ color: "#475569", fontFamily: "iranSans-r" }}
        >
          جدیدترین و تخصصی‌ترین دوره‌های آموزشی
        </p>
      </motion.div>
    </div>
  );
}