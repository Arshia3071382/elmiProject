"use client";

import React, { useState } from "react";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import StudentLoginModal from "./StudentLoginModal";
import StudentRegisterModal from "./StudentRegisterModal";

export default function StudentAuthButtons() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // پاکسازی اطلاعات قبلی هنگام باز کردن پنل‌ها برای جلوگیری از تداخل حساب‌ها
  const handleOpenLogin = () => {
    localStorage.removeItem("studentNationalId");
    localStorage.removeItem("studentPhone");
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    localStorage.removeItem("studentNationalId");
    localStorage.removeItem("studentPhone");
    setIsRegisterOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto my-10 px-4" dir="rtl">
        
        {/* دکمه ورود */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={handleOpenLogin}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative block rounded-3xl p-[1.5px] overflow-hidden cursor-pointer focus-visible:outline-none"
        >
          {/* بورد در حال حرکت دور دکمه */}
          <div className="absolute -inset-[100%] opacity-100 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #38BDF8 300deg, #2563EB 330deg, transparent 360deg)",
              }}
            />
          </div>

          {/* بدنه اصلی کارت با پس‌زمینه متحرک و ملایم */}
          <motion.div 
            animate={{
              backgroundColor: [
                "rgba(240, 249, 255, 0.95)",
                "rgba(224, 242, 254, 0.95)",
                "rgba(186, 230, 253, 0.95)",
                "rgba(240, 249, 255, 0.95)",
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center justify-between p-6 sm:p-7 rounded-[22px] border border-[var(--color-border)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(37,99,235,0.15)]"
          >
            {/* سمت راست: متن و عنوان */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-surface)] text-blue-600 border border-[var(--color-border)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <LogIn className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs text-slate-400 font-medium tracking-wide" style={{ fontFamily: 'iranSans-r' }}>
                  حساب کاربری دارید؟
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900 group-hover:text-blue-600 transition-colors duration-200" style={{ fontFamily: 'iranBold' }}>
                  ورود
                </h3>
              </div>
            </div>

            {/* سمت چپ: اکشن و فلش */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[var(--color-text-secondary)] group-hover:text-blue-600 transition-colors duration-200">
              <span className="hidden sm:inline" style={{ fontFamily: 'iranBold' }}>ورود به پنل</span>
              <motion.div
                animate={{ x: hoveredIndex === 0 ? -5 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>


        {/* دکمه ثبت‌نام */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={handleOpenRegister}
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative block rounded-3xl p-[1.5px] overflow-hidden cursor-pointer focus-visible:outline-none"
        >
          {/* بورد در حال حرکت دور دکمه */}
          <div className="absolute -inset-[100%] opacity-100 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #22C55E 300deg, #16A34A 330deg, transparent 360deg)",
              }}
            />
          </div>

          {/* بدنه اصلی کارت با پس‌زمینه متحرک و ملایم */}
          <motion.div 
            animate={{
              backgroundColor: [
                "rgba(240, 253, 244, 0.95)",
                "rgba(220, 252, 231, 0.95)",
                "rgba(187, 247, 208, 0.95)",
                "rgba(240, 253, 244, 0.95)",
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center justify-between p-6 sm:p-7 rounded-[22px] border border-[var(--color-border)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(34,197,94,0.15)]"
          >
            {/* سمت راست: متن و عنوان */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-surface)] text-emerald-600 border border-[var(--color-border)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs text-slate-400 font-medium tracking-wide" style={{ fontFamily: 'iranSans-r' }}>
                  جدید هستید؟
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-900 group-hover:text-emerald-600 transition-colors duration-200" style={{ fontFamily: 'iranBold' }}>
                  ثبت‌نام
                </h3>
              </div>
            </div>

            {/* سمت چپ: اکشن و فلش */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[var(--color-text-secondary)] group-hover:text-emerald-600 transition-colors duration-200">
              <span className="hidden sm:inline" style={{ fontFamily: 'iranBold' }}>عضویت جدید</span>
              <motion.div
                animate={{ x: hoveredIndex === 1 ? -5 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* مودال‌ها */}
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