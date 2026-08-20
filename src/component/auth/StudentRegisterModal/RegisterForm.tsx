// Registration form fields
"use client";

import {
  LockKeyhole,
  Phone,
  CreditCard,
  AtSign,
  Eye,
  EyeOff,
  Loader2,
  User,
  X,  // ← اضافه شد
} from "lucide-react";
import { AuthInput } from "../AuthInput";
import PasswordStrength from "./PasswordStrength";

interface RegisterFormProps {
  // Form values
  username: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptRules: boolean;
  
  // UI states
  showPassword: boolean;
  showConfirmPassword: boolean;
  status: "idle" | "loading" | "success" | "error";
  
  // Errors
  errors: {
    username: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    phone: string;
    password: string;
    confirmPassword: string;
    rules: string;
  };
  
  // Handlers
  onUsernameChange: (val: string) => void;
  onFirstNameChange: (val: string) => void;
  onLastNameChange: (val: string) => void;
  onNationalIdChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  onAcceptRulesChange: (checked: boolean) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onOpenRules: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function RegisterForm({
  username,
  firstName,
  lastName,
  nationalId,
  phone,
  password,
  confirmPassword,
  acceptRules,
  showPassword,
  showConfirmPassword,
  status,
  errors,
  onUsernameChange,
  onFirstNameChange,
  onLastNameChange,
  onNationalIdChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAcceptRulesChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onOpenRules,
  onSubmit,
  onClose,
}: RegisterFormProps) {
  const isLoading = status === "loading" || status === "success";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4.5">
      {/* Username */}
      <AuthInput
        label="نام کاربری"
        placeholder="ali"
        value={username}
        maxLength={15}
        onChange={(e) => onUsernameChange(e.target.value)}
        error={errors.username}
        icon={<AtSign className="w-4 h-4" />}
        disabled={isLoading}
      />

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthInput
          label="نام (فارسی)"
          placeholder="مثال: علی"
          value={firstName}
          maxLength={30}
          onChange={(e) => onFirstNameChange(e.target.value)}
          error={errors.firstName}
          icon={<User className="w-4 h-4" />}
          disabled={isLoading}
        />
        <AuthInput
          label="نام خانوادگی (فارسی)"
          placeholder="مثال: رضایی"
          value={lastName}
          maxLength={30}
          onChange={(e) => onLastNameChange(e.target.value)}
          error={errors.lastName}
          icon={<User className="w-4 h-4" />}
          disabled={isLoading}
        />
      </div>

      {/* National ID */}
      <AuthInput
        label="کد ملی"
        placeholder="کد ملی ۱۰ رقمی معتبر"
        value={nationalId}
        maxLength={10}
        onChange={(e) => onNationalIdChange(e.target.value)}
        error={errors.nationalId}
        icon={<CreditCard className="w-4 h-4" />}
        disabled={isLoading}
      />

      {/* Phone */}
      <AuthInput
        label="شماره تماس"
        placeholder="09123456789"
        type="tel"
        maxLength={11}
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        error={errors.phone}
        icon={<Phone className="w-4 h-4" />}
        disabled={isLoading}
      />

      {/* Password */}
      <div className="flex flex-col gap-1">
        <AuthInput
          label="رمز عبور"
          placeholder="بین ۶ تا ۸ کاراکتر (A-z, 0-9)"
          type={showPassword ? "text" : "password"}
          value={password}
          maxLength={8}
          onChange={(e) => onPasswordChange(e.target.value)}
          error={errors.password}
          icon={<LockKeyhole className="w-4 h-4" />}
          rightElement={
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          disabled={isLoading}
        />
        <PasswordStrength password={password} error={errors.password} />
      </div>

      {/* Confirm Password */}
      <AuthInput
        label="تکرار رمز عبور"
        placeholder="تکرار دقیق رمز عبور"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        maxLength={8}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        error={errors.confirmPassword}
        icon={<LockKeyhole className="w-4 h-4" />}
        rightElement={
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
        disabled={isLoading}
      />

      {/* Rules acceptance */}
      <div className="flex flex-col gap-1.5 mt-2 p-4 bg-emerald-50/40 border border-emerald-100/80 rounded-2xl">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptRules}
            onChange={(e) => onAcceptRulesChange(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 shrink-0 cursor-pointer"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenRules();
            }}
            className="text-xs sm:text-sm text-slate-700 leading-relaxed text-right hover:text-emerald-800 transition-colors cursor-pointer"
          >
            من متوجه شدم که حفظ اطلاعات کاربری و رمز عبور بر عهده خودم
            است و در صورت افشا، عواقب آن با دانش‌آموز خواهد بود.
            همچنین با{" "}
            <span className="text-emerald-600 font-bold underline">
              قوانین و شرایط استفاده از سامانه
            </span>{" "}
            موافقم.
          </button>
        </label>
        {errors.rules && (
          <span className="text-xs text-red-500 font-bold mr-7">
            {errors.rules}
          </span>
        )}
      </div>

      {/* Submit buttons */}
      <div className="flex items-center gap-3 mt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>در حال ایجاد حساب...</span>
            </>
          ) : (
            "ثبت‌نام و ورود به سامانه"
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all cursor-pointer"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}