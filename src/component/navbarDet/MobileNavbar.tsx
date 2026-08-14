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
  ShieldCheck,
  GraduationCap,
  Trophy,
  Rocket,
  LogIn,
  UserPlus,
} from "lucide-react";

import HeroLogo from "./HeroLogo";
import FloatingActionDock from "./FloatingActionDock";
import Container from "@/component/Container";
import SeniorAdminLoginModal from "@/component/seniorAdmin/SeniorAdminLoginModal";
import { useSeniorAdminLogin } from "@/component/seniorAdmin/useSeniorAdminLogin";

// فرض بر این است که مودال‌های ورود و ثبت‌نام دانش‌آموز را دارید (مسیرها را مطابق پروژه خود تنظیم کنید)
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

interface Notice {
  _id: string;
  isRead: boolean;
}

interface MobileNavbarProps {
  logo: StaticImageData;
}

export default function MobileNavbar({ logo }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);
  
  // استیت‌های مودال‌های دانش‌آموزی
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const pathname = usePathname();

  // استفاده از هوک مدیریت لاگین ادمین
  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    handleLoginSuccess,
  } = useSeniorAdminLogin();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch("/api/notices?limit=100");
        if (response.ok) {
          const data = await response.json();
          const unread = data.notices.filter((n: Notice) => !n.isRead);
          setUnreadCount(unread.length);
          setHasUnread(unread.length > 0);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
    const interval = setInterval(fetchNotices, 30000);
    return () => clearInterval(interval);
  }, []);

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
    { label: "معرفی اساتید", href: "/teachers", icon: GraduationCap },
    { label: "آشنایی با لیگ نخبگان", href: "/league-guide", icon: Trophy },
    { label: "آشنایی با برهان", href: "/", icon: Rocket },
  ];

  const handleOpenLoginModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    openLoginModal();
  };

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
            {/* Navbar */}
            <nav className="relative flex h-16 w-full items-center justify-between rounded-2xl border border-white/80 bg-white/75 px-3.5 backdrop-blur-2xl transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)]">
              <div className="relative z-10 flex items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
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

              <HeroLogo logo={logo} />

              <div className="relative z-10 flex items-center">
                <Link href="/notices" aria-label="اعلانات">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    animate={
                      hasUnread
                        ? {
                            rotate: [0, -15, 15, -15, 15, 0],
                            scale: [1, 1.08, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.2,
                      repeat: hasUnread ? Infinity : 0,
                      repeatDelay: 8,
                      ease: "easeInOut",
                    }}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-100/70 text-slate-700 backdrop-blur-md active:bg-slate-200 shadow-sm"
                  >
                    <Bell className="h-4.5 w-4.5 text-slate-700" />

                    {hasUnread && (
                      <>
                        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                        <span className="absolute top-0 right-0 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                        </span>
                      </>
                    )}
                  </motion.div>
                </Link>
              </div>
            </nav>

            <FloatingActionDock />
          </div>
        </Container>
      </header>

      <div className="h-32 lg:hidden" />

      {/* Drawer Navigation */}
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
              className="fixed inset-y-0 right-0 w-[88%] max-w-sm border-l border-white/60 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-['iranBold'] text-sm text-slate-900">
                        علمی منتظران
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        پلتفرم آموزشی هوشمند
                      </p>
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

                {/* بخش دکمه‌های ورود و ثبت‌نام با بورد متحرک */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* دکمه ورود */}
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className="group relative block rounded-2xl p-[1px] overflow-hidden cursor-pointer"
                  >
                    <div className="absolute -inset-[100%] pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                        style={{
                          background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #38BDF8 300deg, #2563EB 330deg, transparent 360deg)",
                        }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-[15px] bg-sky-50/90 text-blue-900 font-bold text-xs transition-all duration-300 group-hover:bg-sky-100">
                      <LogIn className="h-4 w-4 text-blue-600" />
                      <span>ورود</span>
                    </div>
                  </div>

                  {/* دکمه ثبت‌نام */}
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      setIsRegisterOpen(true);
                    }}
                    className="group relative block rounded-2xl p-[1px] overflow-hidden cursor-pointer"
                  >
                    <div className="absolute -inset-[100%] pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                        style={{
                          background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #22C55E 300deg, #16A34A 330deg, transparent 360deg)",
                        }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-[15px] bg-emerald-50/90 text-emerald-900 font-bold text-xs transition-all duration-300 group-hover:bg-emerald-100">
                      <UserPlus className="h-4 w-4 text-emerald-600" />
                      <span>ثبت‌نام</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
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
                        transition={{ delay: 0.04 * (idx + 1), type: "spring" }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all active:scale-[0.98]"
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

              {/* پنل مدیریت در پایین منو */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenLoginModal}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <ShieldCheck className="h-4 w-4 text-slate-500" />
                  <span>ورود به پنل مدیریت</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* مودال‌های دانش‌آموزی */}
      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {/* مودال ورود مدیر ارشد */}
      <SeniorAdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}