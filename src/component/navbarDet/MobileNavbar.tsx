"use client";

import React, { useState, useEffect } from "react";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell,
  X, 
  ChevronLeft, 
  Sparkles,
  Newspaper,
  PhoneCall,
  Info,
  ShieldCheck
} from "lucide-react";

import HeroLogo from "./HeroLogo";
import FloatingActionDock from "./FloatingActionDock";
import Container from "../Container";

interface MobileNavbarProps {
  logo: StaticImageData;
  hasUnreadNotification?: boolean;
}

export default function MobileNavbar({ 
  logo, 
  hasUnreadNotification = true 
}: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const secondaryLinks = [
    { label: "اخبار و اطلاعیه‌ها", href: "/notices", icon: Newspaper },
    { label: "درباره ما", href: "/aboutUs", icon: Info },
    { label: "ارتباط با ما", href: "/contactUs", icon: PhoneCall },
  ];

  return (
    <>
      <header 
        dir="rtl" 
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 lg:hidden ${
          isScrolled ? "pt-2" : "pt-3"
        }`}
      >
        <Container>
          <div className="flex flex-col items-center">
            
            {/* ۱. شاسی اصلی Navbar با تقارن کامل بصری */}
            <nav 
              className="relative flex h-16 w-full items-center justify-between rounded-2xl border border-white/80 bg-white/75 px-3.5 backdrop-blur-2xl transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)]"
            >
              {/* سمت راست: منوی همبرگری */}
              <div className="relative z-10 flex items-center">
                <motion.button
                  whileTap={{ scale: 0.90 }}
                  onClick={() => setIsOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-100/70 text-slate-800 backdrop-blur-md active:bg-slate-200 shadow-sm"
                  aria-label="باز کردن منو"
                >
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <span className="h-0.5 w-4.5 rounded-full bg-slate-800" />
                    <span className="h-0.5 w-3 rounded-full bg-slate-600 self-start" />
                    <span className="h-0.5 w-4.5 rounded-full bg-slate-800" />
                  </div>
                </motion.button>
              </div>

              {/* مرکز: لوگوی شناور زنده */}
              <HeroLogo logo={logo} />

              {/* سمت چپ: دکمه اعلانات (Notification Button) */}
              <div className="relative z-10 flex items-center">
                <Link href="/notices" aria-label="اعلانات">
                  <motion.div
                    whileTap={{ scale: 0.90 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: 8,
                      ease: "easeInOut",
                    }}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-100/70 text-slate-700 backdrop-blur-md active:bg-slate-200 shadow-sm"
                  >
                    <Bell className="h-4.5 w-4.5 text-slate-700" />
                    
                    {/* نقطه قرمز جلب توجه با Glow کوتاه */}
                    {hasUnreadNotification && (
                      <span className="absolute top-2 left-2 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      </span>
                    )}
                  </motion.div>
                </Link>
              </div>
            </nav>

            {/* ۲. اکشن دک شناور (Floating Action Dock) در زیر Navbar */}
            <FloatingActionDock />

          </div>
        </Container>
      </header>

      {/* فاصله‌دهنده محتوای اصلی برای جلوگیری از اورلپ در صفحه */}
      <div className="h-32 lg:hidden" />

      {/* ۳. کشوی ناوبری RTL (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <div dir="rtl" className="relative z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/35 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 w-[82%] max-w-sm border-l border-white/60 bg-white/92 p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-['iranBold'] text-sm text-slate-900">علمی منتظران</h3>
                      <p className="text-[10px] text-slate-400">پلتفرم آموزشی هوشمند</p>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 px-2 mb-1">
                    صفحات اصلی
                  </span>

                  {secondaryLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 * (idx + 1), type: "spring" }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-xl p-3 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 text-slate-400" />
                            <span>{link.label}</span>
                          </div>
                          <ChevronLeft className="h-3.5 w-3.5 text-slate-300" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link href="/admin">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                    <span>ورود به پنل مدیریت</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}