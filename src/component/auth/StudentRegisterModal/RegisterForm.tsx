"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  AtSign,
  CreditCard,
  Phone,
  LockKeyhole,
  HelpCircle,
  KeyRound,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import PasswordStrength from "./PasswordStrength";

export const DEFAULT_SECURITY_QUESTIONS = [
  "نام اولین معلم شما چه بوده است؟",
  "نام شهر محل تولد شما چیست؟",
  "کتاب مورد علاقه شما در دوران کودکی چه بود؟",
  "نام اولین حیوان خانگی شما چیست؟",
  "رنگ مورد علاقه شما چیست؟",
];

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenRules: () => void;
}

export default function StudentRegisterModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenRules,
}: StudentRegisterModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!username.trim()) newErrors.username = "وارد کردن نام کاربری الزامی است.";
      if (!firstName.trim()) newErrors.firstName = "وارد کردن نام الزامی است.";
      if (!lastName.trim()) newErrors.lastName = "وارد کردن نام خانوادگی الزامی است.";
    } else if (currentStep === 2) {
      if (!/^\d{10}$/.test(nationalId)) newErrors.nationalId = "کد ملی باید ۱۰ رقم باشد.";
      if (!/^09\d{9}$/.test(phone)) newErrors.phone = "شماره تماس معتبر نیست (مثال: 09123456789).";
    } else if (currentStep === 3) {
      if (password.length < 6 || password.length > 8) {
        newErrors.password = "رمز عبور باید بین ۶ تا ۸ کاراکتر باشد.";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "تکرار رمز عبور مطابقت ندارد.";
      }
    } else if (currentStep === 4) {
      if (!securityQuestion) newErrors.securityQuestion = "انتخاب سوال امنیتی الزامی است.";
      if (!securityAnswer.trim()) newErrors.securityAnswer = "وارد کردن پاسخ امنیتی الزامی است.";
      if (!acceptRules) newErrors.rules = "پذیرش قوانین و شرایط سامانه الزامی است.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setErrors({});
      if (step < 4) setStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-[iranBold]">ثبت‌نام دانش‌آموز جدید</h2>
            <p className="text-xs text-slate-400 font-[iranSans-r] mt-0.5">
              مرحله {step} از ۴ - اطلاعات حساب کاربری
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? "bg-emerald-600" : "bg-slate-100"
              }`}
            />
          ))}
        </div>

        <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {/* مرحله اول: نام و نام خانوادگی و نام کاربری */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">نام کاربری</label>
                  <div className="relative">
                    <AtSign className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="مثال: ali_m"
                      value={username}
                      maxLength={15}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r]"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.username}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 font-[iranBold]">نام (فارسی)</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="مثال: علی"
                        value={firstName}
                        maxLength={30}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r]"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 font-[iranBold]">نام خانوادگی (فارسی)</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="مثال: محمدی"
                        value={lastName}
                        maxLength={30}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r]"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.lastName}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* مرحله دوم: کد ملی و شماره تماس */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">کد ملی</label>
                  <div className="relative">
                    <CreditCard className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="کد ملی ۱۰ رقمی معتبر"
                      value={nationalId}
                      maxLength={10}
                      dir="ltr"
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r] text-right"
                    />
                  </div>
                  {errors.nationalId && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.nationalId}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">شماره تماس</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="09123456789"
                      maxLength={11}
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r] text-right"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.phone}</p>}
                </div>
              </motion.div>
            )}

            {/* مرحله سوم: تعیین رمز و تکرار رمز */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">رمز عبور</label>
                  <div className="relative">
                    <LockKeyhole className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="بین ۶ تا ۸ کاراکتر"
                      value={password}
                      maxLength={8}
                      dir="ltr"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 pr-12 pl-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r] text-right"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <PasswordStrength password={password} error={errors.password} />
                  {errors.password && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">تکرار رمز عبور</label>
                  <div className="relative">
                    <LockKeyhole className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="تکرار دقیق رمز عبور"
                      value={confirmPassword}
                      maxLength={8}
                      dir="ltr"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 pr-12 pl-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r] text-right"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.confirmPassword}</p>}
                </div>
              </motion.div>
            )}

            {/* مرحله چهارم: تعیین سوال و عدد/کلمه شخصی مهم */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">
                    سوال امنیتی (جهت بازیابی رمز عبور)
                  </label>
                  <div className="relative">
                    <HelpCircle className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                      className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r] bg-white text-slate-700"
                    >
                      <option value="">یک سوال انتخاب کنید...</option>
                      {DEFAULT_SECURITY_QUESTIONS.map((q, idx) => (
                        <option key={idx} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.securityQuestion && (
                    <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.securityQuestion}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 font-[iranBold]">کلمه مهم شخصی / پاسخ امنیتی</label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="مثال: نام اولین معلم یا عدد خاص"
                      value={securityAnswer}
                      maxLength={50}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r]"
                    />
                  </div>
                  {errors.securityAnswer && <p className="text-red-500 text-xs mt-1 font-[iranSans-r]">{errors.securityAnswer}</p>}
                </div>

                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptRules}
                      onChange={(e) => setAcceptRules(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 shrink-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenRules();
                      }}
                      className="text-xs text-slate-600 leading-relaxed text-right hover:text-emerald-800 transition-colors"
                    >
                      مسئولیت حفظ اطلاعات کاربری را پذیرفته و با{" "}
                      <span className="text-emerald-600 font-bold underline">قوانین سامانه</span> موافقم.
                    </button>
                  </label>
                  {errors.rules && <p className="text-red-500 text-xs font-bold mr-7">{errors.rules}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-[iranBold]"
              >
                <ArrowRight className="w-4 h-4" />
                مرحله قبل
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 font-[iranBold]"
              >
                ادامه
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 font-[iranBold]"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال ثبت‌نام...
                  </>
                ) : (
                  "تایید و ثبت‌نام نهایی"
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}