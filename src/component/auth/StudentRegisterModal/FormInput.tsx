// components/auth/StudentRegisterModal/FormInput.tsx
"use client";

import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  icon?: React.ElementType;
  maxLength?: number;
  className?: string;
  dir?: "rtl" | "ltr";
  showToggle?: boolean;
  onToggleShow?: () => void;
  isShowing?: boolean;
}

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  maxLength,
  className = "",
  dir = "rtl",
  showToggle = false,
  onToggleShow,
  isShowing = false,
}: FormInputProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-slate-700 font-[iranBold]">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        dir={dir}
        className={`w-full px-4 py-3 rounded-2xl border ${
          error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"
        } focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-emerald-200"
        } transition-all text-sm font-[iranSans-r] ${Icon ? "pr-12" : ""} ${showToggle ? "pl-12" : ""} ${className}`}
      />
      {showToggle && onToggleShow && (
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isShowing ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 font-[iranSans-r] flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);