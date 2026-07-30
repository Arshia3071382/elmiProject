"use client";

import React, { useState, useEffect } from "react";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  User,
  KeyRound,
  Lock
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
  const router = useRouter();

  // وضعیت‌های مربوط به مودال لاگین معین ارشد
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // مدیریت درخواست احراز هویت معین ارشد
  const handleSeniorAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError("لطفاً نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/senior-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsLoginModalOpen(false);
        setIsOpen(false);
        setUsernameInput("");
        setPasswordInput("");
        router.push("/senior-admin");
      } else {
        setLoginError(data.error || "نام کاربری یا رمز عبور اشتباه است.");
      }
    } catch {
      setLoginError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLoginModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false); // بستن دکمه همبرگری/دراور
    setIsLoginModalOpen(true); // باز کردن مودال لاگین
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

              {/* باز کردن مودال ورود با کلیک روی دکمه ورود به پنل */}
              <div className="pt-4 border-t border-slate-100">
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

      {/* ۴. مودال ورود اختصاصی معین ارشد (تم روشن + مارجین تاپ ۲۰) */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div dir="rtl" className="fixed inset-0 z-[120] flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative mt-20 w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100 shadow-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-['iranBold'] text-slate-900">
                  احراز هویت معین ارشد
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  جهت دسترسی به پنل مدیریت، اطلاعات حساب خود را وارد کنید
                </p>
              </div>

              <form onSubmit={handleSeniorAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    نام کاربری
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="نام کاربری (مثلاً davood)"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 pr-11 pl-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 pr-11 pl-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs text-rose-500 font-bold text-center mt-1">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all mt-2 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "تأیید و ورود به پنل"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}