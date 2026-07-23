"use client";

import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { MessageCircle, Trophy, BookOpen } from "lucide-react";

interface MobileNavbarProps {
  logo: StaticImageData;
  showLogo: boolean;
  showCourses: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileNavbar({
  logo,
  showLogo,
  showCourses,
  isOpen,
  setIsOpen,
}: MobileNavbarProps) {
  return (
    <div className="flex lg:hidden w-full px-4 fixed top-3 left-0 right-0 z-50 font-['iranSans-r']" dir="rtl">
      {/* کارت اصلی نوار موبایل */}
      <div className="w-full bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-2xl shadow-lg h-16 px-4 flex items-center justify-between relative transition-all duration-300">
        
        {/* ۱. سمت راست: دکمه همبرگری */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center gap-1 w-9 h-9 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] shrink-0 transition-transform active:scale-95"
          aria-label="منو"
        >
          <span
            className={`h-0.5 w-4 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`h-0.5 w-4 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-4 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>

        {/* ۲. وسط: لوگو (دقیقا در مرکز ریاضی با absolute) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 shrink-0"
          style={{ opacity: showLogo ? 1 : 0 }}
        >
          <Link href="/" className="block">
            <Image
              width={70}
              height={35}
              src={logo}
              alt="sitelogo"
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* ۳. سمت چپ: دکمه‌های اکشن */}
        <div
          className="flex items-center gap-1.5 shrink-0 transition-opacity duration-500"
          style={{ opacity: showCourses ? 1 : 0 }}
        >
          {/* گفتینو */}
          <Link href="/chat-guidance" title="گفتینو">
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--color-secondary)] text-[var(--color-text-invert)] text-[11px] font-['iranBold'] shadow-sm active:scale-95 transition-all">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">گفتینو</span>
            </button>
          </Link>

          {/* لیگ نخبگان */}
          <Link href="/elite-league" title="لیگ نخبگان">
            <button className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[11px] font-['iranBold'] active:scale-95 transition-all flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">نخبگان</span>
            </button>
          </Link>

          {/* دوره‌ها */}
          <Link href="/courses" title="دوره‌ها">
            <button className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] text-[11px] font-['iranBold'] active:scale-95 transition-all flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دوره‌ها</span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}