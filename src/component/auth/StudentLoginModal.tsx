"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, LockKeyhole, Phone, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthInput } from "./AuthInput";

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function StudentLoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: StudentLoginModalProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

 const handleResetAndClose = () => {
    if (status === "loading") return;
    setPhone("");
    setPassword("");
    setPhoneError("");
    setPasswordError("");
    setStatus("idle");
    setErrorMessage("");
    onClose(); // <-- اینجا حتماً onClose صدا زده شود تا والد (StudentAuthButtons) مطلع شود
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status]);

  const validateForm = () => {
    let isValid = true;
    setPhoneError("");
    setPasswordError("");

    const phoneRegex = /^09[0-9]{9}$/;
    if (!phone) {
      setPhoneError("شماره تماس الزامی است.");
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("شماره تماس باید با 09 شروع شده و ۱۱ رقم باشد.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("رمز عبور الزامی است.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        
        setTimeout(() => {
          handleResetAndClose();
          // استفاده از روتور نکست‌جی‌اس برای انتقال پایدار در موبایل
          router.push("/student/dashboard");
          router.refresh();
        }, 1000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "خطا در ورود اطلاعات.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("مشکل در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          {/* Overlay */}
          <motion.div
          
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-[450px] max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8 z-10"
          >
            {/* دکمه بستن */}
            <button
              onClick={handleResetAndClose}
              disabled={status === "loading"}
              className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all"
              aria-label="بستن"
            >
              <X className="w-4 h-4" />
            </button>

            {/* هدر */}
            <div className="mb-6 text-right">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ورود به پنل دانش‌آموز
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                برای ورود به حساب کاربری خود، شماره تماس و رمز عبور را وارد کنید.
              </p>
            </div>

            {/* حالت‌های موفقیت / خطا */}
            {status === "success" && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium">ورود با موفقیت انجام شد. در حال انتقال...</span>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            {/* فرم */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AuthInput
                label="شماره تماس"
                placeholder="09123456789"
                type="text"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                error={phoneError}
                icon={<Phone className="w-4 h-4" />}
                disabled={status === "loading" || status === "success"}
              />

              <AuthInput
                label="رمز عبور"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                icon={<LockKeyhole className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                disabled={status === "loading" || status === "success"}
              />

              {/* راهنما */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">شماره موبایل ۱۱ رقمی خود را وارد کنید</span>
              </div>

              {/* دکمه‌ها */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>در حال بررسی...</span>
                    </>
                  ) : (
                    "ورود به پنل"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={status === "loading"}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
                >
                  انصراف
                </button>
              </div>
            </form>

            {/* سوییچ به ثبت‌نام */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
              حساب کاربری ندارید؟{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 font-bold hover:underline mr-1"
              >
                ثبت‌نام کنید
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}