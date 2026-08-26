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
import { useSeniorAdminLogin } from "@/component/seniorAdmin/useSeniorAdminLogin";

// فرض بر این است که مودال‌های ورود و ثبت‌نام دانش‌آموز را دارید (مسیرها را مطابق پروژه خود تنظیم کنید)
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

interface Notice {
  _id: string;
  isRead: boolean;
  createdAt?: string; // اضافه شدن فیلد تاریخ ساخت برای مقایسه
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

          if (unread.length > 0) {
            // خواندن زمان آخرین کلیک روی زنگوله از localStorage
            const lastCheckedTime = localStorage.getItem("last_bell_click_time");

            // بررسی اینکه آیا اعلانی جدیدتر از آخرین کلیک کاربر وجود دارد یا خیر
            const hasNewerNotice = unread.some((n: Notice) => {
              if (!n.createdAt) return true;
              return !lastCheckedTime || new Date(n.createdAt).getTime() > Number(lastCheckedTime);
            });

            setHasUnread(hasNewerNotice);
          } else {
            setHasUnread(false);
          }
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
          isScrolled ? "pt-1.5" : "pt-2"
        }`}
      >
        <Container>
          <div className="flex flex-col items-center">
            {/* Navbar */}
            <nav className="relative flex h-14 w-full items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-3.5 backdrop-blur-xl transition-all duration-500 shadow-[0_4px_20px_rgb(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)]">
              <div className="relative z-10 flex items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-50/70 text-slate-800 backdrop-blur-md active:bg-slate-100 shadow-2xs"
                  aria-label="باز کردن منو"
                >
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <span className="h-0.5 w-4 rounded-full bg-slate-800" />
                    <span className="h-0.5 w-2.5 rounded-full bg-slate-600 self-start mr-0.5" />
                    <span className="h-0.5 w-4 rounded-full bg-slate-800" />
                  </div>
                </motion.button>
              </div>

              {/* لوگو دقیقاً در مرکز صفحه با پوزیشن مطلق */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center pointer-events-auto">
                <HeroLogo logo={logo} />
              </div>

              <div className="relative z-10 flex items-center">
                <Link
                  href="/notices"
                  aria-label="اعلانات"
                  onClick={() => {
                    // محو کردن فوری دایره قرمز و صفر کردن تعداد
                    setHasUnread(false);
                    setUnreadCount(0);
                    // ذخیره زمان فعلی در لوکال‌استوری تا با رفرش هم دایره برنگردد
                    localStorage.setItem("last_bell_click_time", Date.now().toString());
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-50/70 text-slate-700 backdrop-blur-md active:bg-slate-100 shadow-2xs"
                  >
                    <Bell className="h-4 w-4 text-slate-700" />

                    {hasUnread && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75 [animation-duration:2s]" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]" />
                      </span>
                    )}
                  </motion.div>
                </Link>
              </div>
            </nav>

            {/* کاهش فاصله اکشن ایسلند با ناوبر */}
            <div className="-mt-1 w-full">
              <FloatingActionDock />
            </div>
          </div>
        </Container>
      </header>

      <div className="h-28 lg:hidden" />

      {/* Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <div dir="rtl" className="relative z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-xs border-l border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-['iranBold'] text-xs text-slate-900">
                        علمی منتظران
                      </h3>
                      <p className="text-[9px] text-slate-400">
                        پلتفرم آموزشی هوشمند
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-100/80 text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                </div>

                {/* بخش دکمه‌های ورود و ثبت‌نام با بورد متحرک */}
                <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                  {/* دکمه ورود */}
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className="group relative block rounded-xl p-[1px] overflow-hidden cursor-pointer"
                  >
                    <div className="absolute -inset-[100%] pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0"
                        style={{
                          background:
                            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #38BDF8 300deg, #2563EB 330deg, transparent 360deg)",
                        }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[11px] bg-sky-50/90 text-blue-900 font-bold text-xs transition-all duration-300 group-hover:bg-sky-100">
                      <LogIn className="h-3.5 w-3.5 text-blue-600" />
                      <span>ورود</span>
                    </div>
                  </div>

                  {/* دکمه ثبت‌نام */}
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      setIsRegisterOpen(true);
                    }}
                    className="group relative block rounded-xl p-[1px] overflow-hidden cursor-pointer"
                  >
                    <div className="absolute -inset-[100%] pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0"
                        style={{
                          background:
                            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #22C55E 300deg, #16A34A 330deg, transparent 360deg)",
                        }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[11px] bg-emerald-50/90 text-emerald-900 font-bold text-xs transition-all duration-300 group-hover:bg-emerald-100">
                      <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
                      <span>ثبت‌نام</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 px-2 mb-1">
                    صفحات اصلی
                  </span>

                  {secondaryLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * (idx + 1), type: "spring" }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-xl p-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-slate-400" />
                            <span>{link.label}</span>
                          </div>
                          <ChevronLeft className="h-3 w-3 text-slate-300" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
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

     
    </>
  );
}