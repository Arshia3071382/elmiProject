"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  LockKeyhole,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
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
  // Login form states
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Forgot password modal states
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [fetchedQuestion, setFetchedQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [forgotStatus, setForgotStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [forgotError, setForgotError] = useState("");

  const handleResetAndClose = () => {
    if (status === "loading") return;
    setPhone("");
    setPassword("");
    setPhoneError("");
    setPasswordError("");
    setStatus("idle");
    setErrorMessage("");
    resetForgotPasswordState();
    onClose();
  };

  const resetForgotPasswordState = () => {
    setIsForgotPasswordOpen(false);
    setForgotStep(1);
    setForgotIdentifier("");
    setFetchedQuestion("");
    setSecurityAnswer("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotStatus("idle");
    setForgotError("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isForgotPasswordOpen) resetForgotPasswordState();
        else handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, isForgotPasswordOpen]);

  const validateForm = () => {
    let isValid = true;
    setPhoneError("");
    setPasswordError("");

    if (!phone.trim()) {
      setPhoneError("نام کاربری یا شماره تماس الزامی است.");
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: phone.trim(), password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");

        if (data.student?.nationalId) {
          localStorage.setItem("studentNationalId", data.student.nationalId);
        }
        localStorage.setItem("studentPhone", phone.trim());

        setTimeout(() => {
          handleResetAndClose();
          window.location.href = data.redirectUrl || "/student/dashboard";
        }, 1000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "نام کاربری یا رمز عبور اشتباه است.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("مشکل در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  // handlers بازیابی رمز عبور
  const handleFetchSecurityQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setForgotError("لطفاً کد ملی یا شماره همراه خود را وارد کنید.");
      return;
    }

    setForgotStatus("loading");
    setForgotError("");

    try {
      const res = await fetch("/api/auth/student/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getQuestion", identifier: forgotIdentifier.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFetchedQuestion(data.question);
        setForgotStep(2);
        setForgotStatus("idle");
      } else {
        setForgotStatus("error");
        setForgotError(data.message || "کاربری با این مشخصات یافت نشد.");
      }
    } catch {
      setForgotStatus("error");
      setForgotError("خطا در ارتباط با سرور.");
    }
  };

  const handleVerifyAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityAnswer.trim()) {
      setForgotError("ورود کلمه شخصی الزامی است.");
      return;
    }

    setForgotStatus("loading");
    setForgotError("");

    try {
      const res = await fetch("/api/auth/student/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verifyAnswer",
          identifier: forgotIdentifier.trim(),
          answer: securityAnswer.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForgotStep(3);
        setForgotStatus("idle");
      } else {
        setForgotStatus("error");
        setForgotError(data.message || "کلمه شخصی وارد شده اشتباه است.");
      }
    } catch {
      setForgotStatus("error");
      setForgotError("خطا در بررسی پاسخ.");
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setForgotError("رمز عبور جدید را وارد کنید.");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 8) {
      setForgotError("رمز عبور باید بین ۶ تا ۸ کاراکتر باشد.");
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(newPassword)) {
      setForgotError("رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError("تکرار رمز عبور جدید مطابقت ندارد.");
      return;
    }

    setForgotStatus("loading");
    setForgotError("");

    try {
      const res = await fetch("/api/auth/student/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resetPassword",
          identifier: forgotIdentifier.trim(),
          answer: securityAnswer.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForgotStatus("success");
        setTimeout(() => {
          resetForgotPasswordState();
          setPhone(forgotIdentifier);
          setPassword(newPassword);
        }, 1200);
      } else {
        setForgotStatus("error");
        setForgotError(data.message || "تغییر رمز عبور با خطا مواجه شد.");
      }
    } catch {
      setForgotStatus("error");
      setForgotError("خطا در تغییر رمز عبور.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-[iranSans-r]" dir="rtl">
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
              className="relative w-full max-w-[450px] max-h-[90vh] overflow-y-auto overflow-x-hidden 
                bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-2 sm:p-3 z-10
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-slate-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                scrollbar-thin
                scrollbar-thumb-slate-300"
            >
              <div className="p-4 sm:p-5 relative">
                {/* دکمه بستن */}
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={status === "loading"}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer z-20"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* هدر */}
                <div className="mb-6 text-right">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent font-[iranBold]">
                    ورود به حساب کاربری
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    نام کاربری یا شماره تماس و رمز عبور خود را وارد کنید.
                  </p>
                </div>

                {/* فرم اصلی ورود */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <AuthInput
                      label="نام کاربری / شماره تماس"
                      placeholder="نام کاربری یا 09123456789"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={phoneError}
                      icon={<Phone className="w-4 h-4" />}
                      disabled={status === "loading" || status === "success"}
                    />
                  </div>

                  <div>
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
                          className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      disabled={status === "loading" || status === "success"}
                    />
                    {/* دکمه فراموشی رمز عبور */}
                    <div className="text-left mt-1.5">
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                      >
                        رمز عبور خود را فراموش کرده‌اید؟
                      </button>
                    </div>
                  </div>

                  {status === "success" && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">ورود با موفقیت انجام شد. در حال انتقال...</span>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={status === "loading" || status === "success"}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all cursor-pointer"
                    >
                      انصراف
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
                  حساب کاربری ندارید؟{" "}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-blue-600 font-bold hover:underline mr-1 cursor-pointer font-[iranBold]"
                  >
                    ثبت‌نام کنید
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* مدال بازیابی رمز عبور با سوال امنیتی */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-[iranSans-r]" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForgotPasswordState}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl p-6 z-10 border border-slate-100"
            >
              <button
                type="button"
                onClick={resetForgotPasswordState}
                className="absolute left-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4 text-indigo-600 font-[iranBold]">
                <KeyRound className="w-6 h-6" />
                <h3 className="text-xl font-extrabold">بازیابی رمز عبور</h3>
              </div>

              {/* Step 1: Identifier */}
              {forgotStep === 1 && (
                <form onSubmit={handleFetchSecurityQuestion} className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    برای بازیابی رمز، کد ملی یا شماره همراه ثبت‌شده خود را وارد کنید تا سوال امنیتی شما استعلام شود.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">کد ملی / شماره همراه</label>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="مثال: 0012345678 یا 09123456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-left dir-ltr"
                    />
                  </div>

                  {forgotError && <p className="text-xs text-red-500">{forgotError}</p>}

                  <button
                    type="submit"
                    disabled={forgotStatus === "loading"}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {forgotStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "استعلام سوال امنیتی"}
                  </button>
                </form>
              )}

              {/* Step 2: Answer Question */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyAnswer} className="space-y-4">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <span className="block text-[11px] text-indigo-500 font-bold mb-1">سوال امنیتی شما:</span>
                    <p className="text-sm font-bold text-indigo-950">{fetchedQuestion}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">کلمه مهم شخصی (پاسخ)</label>
                    <input
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="کلمه شخصی را وارد کنید"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {forgotError && <p className="text-xs text-red-500">{forgotError}</p>}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      مرحله قبل
                    </button>
                    <button
                      type="submit"
                      disabled={forgotStatus === "loading"}
                      className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      {forgotStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "تایید پاسخ"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور جدید</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      maxLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="******"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-left dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تکرار رمز عبور جدید</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      maxLength={8}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="******"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-left dir-ltr"
                    />
                  </div>

                  {forgotError && <p className="text-xs text-red-500">{forgotError}</p>}

                  {forgotStatus === "success" && (
                    <p className="text-xs text-emerald-600 font-bold">رمز عبور با موفقیت تغییر یافت. جای‌گذاری در فرم لاگین...</p>
                  )}

                  <button
                    type="submit"
                    disabled={forgotStatus === "loading" || forgotStatus === "success"}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {forgotStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "ذخیره رمز عبور جدید"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}