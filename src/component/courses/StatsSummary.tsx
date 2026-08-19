"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Star } from "lucide-react";

interface StatsSummaryProps {
  coursesCount: number;
  categoriesCount: number;
}

export default function StatsSummary({
  coursesCount,
  categoriesCount,
}: StatsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 p-5 rounded-xl"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <BookOpen className="w-4 h-4" style={{ color: "#2563EB" }} />
          </div>
          <p
            className="text-lg font-bold"
            style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
          >
            {coursesCount}
          </p>
          <p
            className="text-xs"
            style={{ color: "#475569", fontFamily: "iranSans-r" }}
          >
            دوره
          </p>
        </div>

        <div className="text-center">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <Users className="w-4 h-4" style={{ color: "#22C55E" }} />
          </div>
          <p
            className="text-lg font-bold"
            style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
          >
            {categoriesCount}
          </p>
          <p
            className="text-xs"
            style={{ color: "#475569", fontFamily: "iranSans-r" }}
          >
            گروه
          </p>
        </div>

        <div className="text-center">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <Star className="w-4 h-4" style={{ color: "#F59E0B" }} />
          </div>
          <p
            className="text-lg font-bold"
            style={{ color: "#1F3A5F", fontFamily: "iranBold" }}
          >
            ۴.۸
          </p>
          <p
            className="text-xs"
            style={{ color: "#475569", fontFamily: "iranSans-r" }}
          >
            امتیاز
          </p>
        </div>
      </div>
    </motion.div>
  );
}
