// Header component
"use client";

import { Bell } from "lucide-react";

interface NoticeHeaderProps {
  total: number;
  unread: number;
}

export default function NoticeHeader({ total, unread }: NoticeHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-bg)] to-blue-50 p-6 md:p-10 shadow-sm mb-6 md:mb-8">
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[var(--color-secondary)]/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="relative flex h-14 w-14 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg shadow-[var(--color-secondary)]/25">
            <Bell
              className={`h-7 w-7 md:h-8 md:w-8 text-[var(--color-text-invert)] ${
                unread > 0 ? "animate-bounce" : ""
              }`}
            />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md animate-pulse">
                {unread}
              </span>
            )}
          </div>

          <div>
            <h1
              className="text-2xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight"
              style={{ fontFamily: "iranBold" }}
            >
              مرکز اعلانات و اخبار
            </h1>
            <p
              className="mt-1.5 md:mt-2 max-w-xl text-xs md:text-sm leading-relaxed text-[var(--color-text-secondary)]"
              style={{ fontFamily: "iranSans-r" }}
            >
              آخرین اخبار، تغییرات کلاس‌ها، اطلاعیه‌های آموزشی و اصلاحیه‌های
              مجموعه علمی منتظران
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 shadow-sm backdrop-blur text-center md:text-right">
            <p
              className="text-[11px] text-[var(--color-text-secondary)]"
              style={{ fontFamily: "iranSans-r" }}
            >
              کل اعلان‌ها
            </p>
            <p
              className="mt-1 text-xl md:text-2xl font-black text-[var(--color-text-primary)]"
              style={{ fontFamily: "iranBold" }}
            >
              {total}
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 shadow-sm text-center md:text-right">
            <p
              className="text-[11px] text-red-500 font-medium"
              style={{ fontFamily: "iranSans-r" }}
            >
              خوانده نشده
            </p>
            <p
              className="mt-1 text-xl md:text-2xl font-black text-red-600"
              style={{ fontFamily: "iranBold" }}
            >
              {unread}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}