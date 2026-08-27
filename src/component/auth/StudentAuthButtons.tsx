"use client";

import React, { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import StudentLoginModal from "./StudentLoginModal";
import StudentRegisterModal from "./StudentRegisterModal";

export default function StudentAuthPillHorizontal() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
      <div className="w-full flex justify-center items-center my-8 px-3" dir="rtl">
        {/* کانتینر کپسولی افقی */}
        <div className="flex flex-row w-full max-w-3xl rounded-[28px] sm:rounded-[36px] p-[2px] sm:p-[2.5px] relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-slate-900/10 backdrop-blur-2xl">
          
          {/* هاله نورانی متحرک دور کل کپسول */}
          <div className="absolute -inset-[150%] opacity-100 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, #38BDF8 120deg, #2563EB 150deg, transparent 180deg, #22C55E 300deg, #16A34A 330deg, transparent 360deg)",
              }}
            />
          </div>

          {/* بخش اول: ورود (نیمه راست) */}
          <motion.div
            onClick={handleOpenLogin}
            animate={{
              backgroundColor: [
                "rgba(240, 249, 255, 0.90)",
                "rgba(224, 242, 254, 0.95)",
                "rgba(186, 230, 253, 0.90)",
                "rgba(240, 249, 255, 0.90)",
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-center sm:justify-start gap-3 sm:gap-5 flex-1 py-4 px-4 sm:p-7 sm:px-8 rounded-r-[26px] sm:rounded-r-[34px] rounded-l-none backdrop-blur-xl border-l border-white/80 cursor-pointer transition-all duration-300 min-w-0"
          >
            <div className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/90 text-blue-600 border border-blue-100 transition-transform duration-300 group-hover:scale-110 shadow-sm shrink-0">
              <LogIn className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div className="flex flex-col gap-0.5 text-right min-w-0">
              <span className="text-[11px] sm:text-sm text-slate-500 font-medium tracking-wide truncate" style={{ fontFamily: 'iranSans-r' }}>
                حساب دارم
              </span>
              <h3 className="text-xl sm:text-4xl font-black tracking-tight text-blue-950 group-hover:text-blue-600 transition-colors duration-200 truncate" style={{ fontFamily: 'iranBold' }}>
                ورود
              </h3>
            </div>
          </motion.div>


          {/* بخش دوم: ثبت‌نام (نیمه چپ) */}
          <motion.div
            onClick={handleOpenRegister}
            animate={{
              backgroundColor: [
                "rgba(240, 253, 244, 0.90)",
                "rgba(220, 252, 231, 0.95)",
                "rgba(187, 247, 208, 0.90)",
                "rgba(240, 253, 244, 0.90)",
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-center sm:justify-start gap-3 sm:gap-5 flex-1 py-4 px-4 sm:p-7 sm:px-8 rounded-l-[26px] sm:rounded-l-[34px] rounded-r-none backdrop-blur-xl border-r border-white/80 cursor-pointer transition-all duration-300 min-w-0"
          >
            <div className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/90 text-emerald-600 border border-emerald-100 transition-transform duration-300 group-hover:scale-110 shadow-sm shrink-0">
              <UserPlus className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div className="flex flex-col gap-0.5 text-right min-w-0">
              <span className="text-[11px] sm:text-sm text-slate-500 font-medium tracking-wide truncate" style={{ fontFamily: 'iranSans-r' }}>
                تازه اومدم
              </span>
              <h3 className="text-xl sm:text-4xl font-black tracking-tight text-emerald-950 group-hover:text-emerald-600 transition-colors duration-200 truncate" style={{ fontFamily: 'iranBold' }}>
                ثبت‌نام
              </h3>
            </div>
          </motion.div>

        </div>
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