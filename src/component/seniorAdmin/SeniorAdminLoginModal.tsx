"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User, KeyRound, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SeniorAdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SeniorAdminLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: SeniorAdminLoginModalProps) {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoginUser, setIsFirstLoginUser] = useState<boolean | null>(
    null
  );

  const resetLoginModal = () => {
    setUsernameInput("");
    setPasswordInput("");
    setLoginError("");
    setIsFirstLoginUser(null);
    setIsLoading(false);
  };

  const checkUsernameStatus = async () => {
    if (!usernameInput.trim()) return;
    setLoginError("");

    try {
      const res = await fetch("/api/senior-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check",
          username: usernameInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsFirstLoginUser(data.isFirstLogin);
      } else {
        setIsFirstLoginUser(null);
      }
    } catch {
      setIsFirstLoginUser(null);
    }
  };

  const handleSeniorAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError("لطفاً نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    if (passwordInput.trim().length < 4) {
      setLoginError("رمز عبور باید حداقل ۴ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    const actionToSend = isFirstLoginUser ? "set_first_password" : "login";

    try {
      const res = await fetch("/api/senior-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionToSend,
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && (data.success || data.user)) {
        resetLoginModal();
        onClose();
        if (onSuccess) onSuccess();
        router.push("/senior-admin");
        router.refresh();
      } else {
        if (data.isFirstLogin) {
          setIsFirstLoginUser(true);
        }
        setLoginError(data.error || "نام کاربری یا رمز عبور اشتباه است.");
      }
    } catch {
      setLoginError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetLoginModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[120] flex items-start justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              onClick={handleClose}
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
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      setIsFirstLoginUser(null);
                    }}
                    onBlur={checkUsernameStatus}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 pr-11 pl-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400"
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isFirstLoginUser
                    ? "تعیین رمز عبور جدید (اولین ورود)"
                    : "رمز عبور"}
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={
                      isFirstLoginUser
                        ? "رمز عبور جدید دلخواه را وارد کنید"
                        : "••••••••"
                    }
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 pr-11 pl-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                {isFirstLoginUser && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                    <Sparkle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      این اولین ورود شماست. رمزی که تایپ می‌کنید در دیتابیس
                      ذخیره شده و رمز اختصاصی شما خواهد بود.
                    </span>
                  </div>
                )}
              </div>

              {loginError && (
                <p className="text-xs text-rose-500 font-bold text-center mt-1">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all mt-2 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
                  isFirstLoginUser
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isFirstLoginUser ? (
                  "ثبت رمز عبور و ورود به پنل"
                ) : (
                  "تأیید و ورود به پنل"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}