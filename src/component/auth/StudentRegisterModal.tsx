"use client";

import React, { useState, useEffect } from "react";
import { X, LockKeyhole, Phone, CreditCard, AtSign, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthInput } from "./AuthInput";

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function StudentRegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: StudentRegisterModalProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rules: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // تابع بررسی اعتبار کد ملی ایران
  const isValidNationalId = (id: string): boolean => {
    if (!/^\d{10}$/.test(id)) return false;
    const check = parseInt(id.substring(9, 10), 10);
    let sum = 0;
    for (let i = 0; i < 9; ++i) {
      sum += parseInt(id.substring(i, i + 1), 10) * (10 - i);
    }
    const rem = sum % 11;
    const computedCheck = rem < 2 ? rem : 11 - rem;
    return computedCheck === check;
  };

  // محاسبه ساده قدرت رمز عبور
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", color: "" };
    if (pass.length < 8) return { label: "ضعیف (حداقل ۸ کاراکتر)", color: "text-red-500" };
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 10) {
      return { label: "قوی", color: "text-emerald-600" };
    }
    return { label: "متوسط", color: "text-amber-600" };
  };

  const strength = getPasswordStrength(password);

  const handleResetAndClose = () => {
    if (status === "loading") return;
    setUsername("");
    setFirstName("");
    setLastName("");
    setNationalId("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setAcceptRules(false);
    setErrors({ username: "", firstName: "", lastName: "", nationalId: "", phone: "", password: "", confirmPassword: "", rules: "" });
    setStatus("idle");
    setErrorMessage("");
    onClose();
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
    const newErrors = { username: "", firstName: "", lastName: "", nationalId: "", phone: "", password: "", confirmPassword: "", rules: "" };

    if (!username.trim() || /\s/.test(username)) {
      newErrors.username = "نام کاربری نامعتبر است (بدون فاصله).";
      isValid = false;
    }

    if (!firstName.trim()) {
      newErrors.firstName = "نام الزامی است.";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است.";
      isValid = false;
    }

    if (!nationalId) {
      newErrors.nationalId = "کد ملی الزامی است.";
      isValid = false;
    } else if (!isValidNationalId(nationalId)) {
      newErrors.nationalId = "کد ملی وارد شده معتبر نیست.";
      isValid = false;
    }

    const phoneRegex = /^09[0-9]{9}$/;
    if (!phone) {
      newErrors.phone = "شماره تماس الزامی است.";
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "شماره تماس وارد شده معتبر نیست.";
      isValid = false;
    }

    if (!password || password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "رمزهای عبور یکسان نیستند.";
      isValid = false;
    }

    if (!acceptRules) {
      newErrors.rules = "پذیرش قوانین و شرایط الزامی است.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          nationalId,
          phone,
          password,
        }),
      });

      const data = await res.json();

      // بررسی خطای ۴۰۹ (کد ملی تکراری)
      if (res.status === 409) {
        setStatus("error");
        setErrorMessage("کد ملی از قبل ثبت شده است. لطفاً وارد شوید.");
        return;
      }

      if (res.ok && data.success) {
        setStatus("success");

        // 🚀 ذخیره اطلاعات کاربر جدید در حافظه مرورگر
        if (nationalId) {
          localStorage.setItem("studentNationalId", nationalId);
        }
        if (phone) {
          localStorage.setItem("studentPhone", phone);
        }

        setTimeout(() => {
          onClose();
          router.push(data.redirectTo || "/student/dashboard");
          router.refresh();
        }, 1200);
      } else {
        // برای سایر خطاهای احتمالی سرور
        setStatus("error");
        setErrorMessage(data.message || "خطایی در ثبت‌نام رخ داد.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("ارتباط با سرور برقرار نشد.");
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
            className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8 z-10"
          >
            {/* دکمه بستن */}
            <button
              type="button"
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
                ثبت‌نام دانش‌آموز
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                برای ایجاد حساب کاربری، اطلاعات خود را با دقت وارد کنید.
              </p>
            </div>

            {/* پیام‌های وضعیت */}
            {status === "success" && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium">ثبت‌نام با موفقیت انجام شد. در حال انتقال به داشبورد...</span>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            {/* فرم ثبت‌نام */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AuthInput
                label="نام کاربری"
                placeholder="یک نام کاربری انتخاب کنید"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                error={errors.username}
                hint="نام کاربری شما برای ورود به حساب استفاده خواهد شد."
                icon={<AtSign className="w-4 h-4" />}
                disabled={status === "loading" || status === "success"}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuthInput
                  label="نام"
                  placeholder="نام خود را وارد کنید"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                  icon={<User className="w-4 h-4" />}
                  disabled={status === "loading" || status === "success"}
                />
                <AuthInput
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی خود را وارد کنید"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={errors.lastName}
                  icon={<User className="w-4 h-4" />}
                  disabled={status === "loading" || status === "success"}
                />
              </div>

              <AuthInput
                label="کد ملی"
                placeholder="کد ملی ۱۰ رقمی"
                value={nationalId}
                maxLength={10}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                error={errors.nationalId}
                icon={<CreditCard className="w-4 h-4" />}
                disabled={status === "loading" || status === "success"}
              />

              <AuthInput
                label="شماره تماس"
                placeholder="09123456789"
                type="tel"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                error={errors.phone}
                icon={<Phone className="w-4 h-4" />}
                disabled={status === "loading" || status === "success"}
              />

              <div className="flex flex-col gap-1">
                <AuthInput
                  label="رمز عبور"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
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
                {password && (
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          password.length < 8 ? "w-1/3 bg-red-500" : password.length < 12 ? "w-2/3 bg-amber-500" : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <AuthInput
                label="تکرار رمز عبور"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<LockKeyhole className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                disabled={status === "loading" || status === "success"}
              />

              {/* قوانین و شرایط */}
              <div className="flex flex-col gap-1 mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptRules}
                    onChange={(e) => setAcceptRules(e.target.checked)}
                    disabled={status === "loading" || status === "success"}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">
                    با{" "}
                    <a
                      href="#rules"
                      onClick={(e) => e.preventDefault()}
                      className="text-emerald-600 font-semibold hover:underline"
                    >
                      قوانین و شرایط استفاده
                    </a>{" "}
                    از سامانه موافقم.
                  </span>
                </label>
                {errors.rules && <span className="text-xs text-red-500 font-medium">{errors.rules}</span>}
              </div>

              {/* دکمه‌ها */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>در حال ثبت‌نام...</span>
                    </>
                  ) : (
                    "ثبت‌نام و ایجاد حساب"
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

            {/* سوییچ به ورود */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
              قبلاً حساب دارید؟{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emerald-600 font-bold hover:underline mr-1"
              >
                وارد شوید
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}