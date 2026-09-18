"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  User,
  Trophy, 
  Rocket, 
  GraduationCap, 
  ChevronLeft,
  Sparkles,
  LogOut
} from "lucide-react";
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

interface AppHeaderProps {
  onMenuClick?: () => void;
  isLoggedIn?: boolean;
  studentName?: string;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
}

export default function AppHeader({
  onMenuClick,
  isLoggedIn: initialIsLoggedIn = false,
  studentName: initialStudentName,
  onLogout,
  onOpenLoginModal,
}: AppHeaderProps) {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [studentName, setStudentName] = useState(initialStudentName || "");

  useEffect(() => {
    setIsMounted(true);

    const checkAuthStatus = () => {
      const studentPhone = localStorage.getItem("studentPhone");
      const studentNationalId = localStorage.getItem("studentNationalId");
      const storedName = localStorage.getItem("studentName");

      const loggedIn = Boolean(studentPhone || studentNationalId);
      setIsLoggedIn(loggedIn);

      if (loggedIn && storedName) {
        setStudentName(storedName);
      } else {
        setStudentName("");
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);

    // مدیریت کش سافاری آیفون (bfcache) در زمان بازگشت به صفحه
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkAuthStatus();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("pageshow", handlePageShow);
      clearInterval(interval);
    };
  }, [initialIsLoggedIn]);

  useEffect(() => {
    if (initialIsLoggedIn !== undefined) {
      setIsLoggedIn(initialIsLoggedIn);
    }
  }, [initialIsLoggedIn]);

  const toggleDrawer = () => {
    if (onMenuClick) {
      onMenuClick();
    }
    setIsDrawerOpen((prev) => !prev);
  };

  const handleOpenLogin = () => {
    if (onOpenLoginModal) {
      onOpenLoginModal();
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsLoggedIn(true);
    
    const studentPhone = localStorage.getItem("studentPhone");
    const studentNationalId = localStorage.getItem("studentNationalId");
    setIsLoggedIn(Boolean(studentPhone || studentNationalId));

    const storedName = localStorage.getItem("studentName");
    if (storedName) setStudentName(storedName);

    router.push("/student/dashboard");
    router.refresh();
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    setIsLoggedIn(true);

    const studentPhone = localStorage.getItem("studentPhone");
    const studentNationalId = localStorage.getItem("studentNationalId");
    setIsLoggedIn(Boolean(studentPhone || studentNationalId));

    const storedName = localStorage.getItem("studentName");
    if (storedName) setStudentName(storedName);

    router.push("/student/dashboard");
    router.refresh();
  };

  const handleLogoutClick = () => {
    setIsDrawerOpen(false);
    setIsLoggedIn(false);
    setStudentName("");
    
    // پاک کردن اطلاعات از حافظه مرورگر
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentNationalId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("token");
    
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }

    if (onLogout) {
      onLogout();
    }

    // استفاده از window.location.href برای جلوگیری از بارگذاری صفحه از کش آیفون
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0d52b5] border-b border-blue-400/20 px-4 py-3.5 flex items-center justify-between shadow-md shadow-blue-900/20" dir="rtl">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-full p-0.5 bg-white/20 shadow-sm">
            <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center overflow-hidden">
              <Image
                src="/icons/logo6.png"
                alt="علمی منتظران"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
          <span className="text-base sm:text-lg font-[iranBold] tracking-tight select-none text-white">
            عـلـــــمـی منتظرانــــ
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isMounted && isLoggedIn ? (
            <button
              onClick={() => router.push('/student/dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#0d52b5] active:scale-95 transition-all flex items-center gap-2 shadow-sm font-[iranBold] text-xs border border-white"
              title="مشاهده پروفایل"
            >
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-[#0d52b5]" />
              </div>
              <span className="whitespace-nowrap">
                {studentName ? studentName : "مشاهده پروفایل"}
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={handleOpenLogin}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 active:scale-95 transition-all flex items-center justify-center"
                title="ورود"
                aria-label="ورود"
              >
                <LogIn className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 active:scale-95 transition-all flex items-center justify-center"
                title="ثبت‌نام"
                aria-label="ثبت‌نام"
              >
                <UserPlus className="w-4 h-4 text-white" />
              </button>
            </>
          )}

          <button
            onClick={toggleDrawer}
            className="p-2.5 mr-0.5 rounded-xl bg-white/10 text-white active:scale-95 transition-all hover:bg-white/20 border border-white/10 flex items-center justify-center"
            aria-label="منوی اصلی"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {isMounted && createPortal(
        <>
          {isDrawerOpen && (
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            />
          )}

          <aside
            dir="rtl"
            className={`fixed top-0 right-0 bottom-0 z-[9999] w-[82%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-5 overflow-y-auto h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-[iranBold] text-slate-800">
                        عـلـــــمـی منتظرانــــ
                      </h2>
                      <p className="text-[10px] text-slate-400">پلتفرم آموزشی هوشمند</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl bg-gray-100/80 text-gray-500 hover:bg-gray-200 transition-colors"
                    aria-label="بستن منو"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {isLoggedIn ? (
                  <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#0d52b5] text-white flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-[iranBold] text-slate-800 block">
                          {studentName || 'دانش‌آموز'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-[iranBold] block">وارد شده‌اید</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        router.push('/student/dashboard');
                      }}
                      className="text-xs text-[#0d52b5] font-[iranBold] bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-sm"
                    >
                      پروفایل
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        handleOpenLogin();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 font-[iranBold] text-xs hover:bg-blue-100 active:scale-95 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      ورود
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setIsRegisterOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-[iranBold] text-xs hover:bg-emerald-100 active:scale-95 transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      ثبت‌نام
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <span className="text-[11px] font-[iranBold] text-slate-400 block px-1">
                    دسترسی‌های سریع
                  </span>

                  <nav className="space-y-1">
                    <Link
                      href="/elite-league"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-[iranBold]">لیگ نخبگان</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-300" />
                    </Link>

                    <Link
                      href="/borhan"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Rocket className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-[iranBold]">آشنایی با برهان</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-300" />
                    </Link>

                    <Link
                      href="/teachers"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-[iranBold]">آشنایی با اساتید</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-300" />
                    </Link>
                  </nav>
                </div>
              </div>

              {isLoggedIn && (
                <button
                  onClick={handleLogoutClick}
                  className="w-full mt-6 flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-[iranBold] text-xs hover:bg-rose-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  خروج از حساب کاربری
                </button>
              )}
            </div>
          </aside>
        </>,
        document.body
      )}

      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}