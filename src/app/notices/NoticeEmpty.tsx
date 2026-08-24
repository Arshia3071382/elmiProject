// Empty state component
"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

interface NoticeEmptyProps {
  hasFilters: boolean;
}

export default function NoticeEmpty({ hasFilters }: NoticeEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-10 md:p-14 text-center shadow-sm"
    >
      <Bell className="mx-auto h-12 w-12 md:h-16 md:w-16 text-[var(--color-text-secondary)]/30" />
      <p
        className="mt-3 text-base md:text-lg font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "iranBold" }}
      >
        هیچ اعلانی یافت نشد
      </p>
      <p
        className="mt-1 text-xs md:text-sm text-[var(--color-text-secondary)]"
        style={{ fontFamily: "iranSans-r" }}
      >
        {hasFilters
          ? "لطفاً فیلترهای جستجو را تغییر دهید"
          : "در حال حاضر اطلاعیه‌ای ثبت نشده است"}
      </p>
    </motion.div>
  );
}