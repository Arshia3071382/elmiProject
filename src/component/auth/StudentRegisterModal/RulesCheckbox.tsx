// components/auth/StudentRegisterModal/RulesCheckbox.tsx
"use client";

import { AlertCircle } from "lucide-react";

interface RulesCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onViewRules: () => void;
  error?: string;
}

export const RulesCheckbox = ({
  checked,
  onChange,
  onViewRules,
  error,
}: RulesCheckboxProps) => (
  <div className="pt-2">
    <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-600 font-[iranSans-r]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
      />
      <span>
        قوانین و مقررات سایت را می‌پذیرم (
        <button
          type="button"
          onClick={onViewRules}
          className="text-emerald-600 underline hover:text-emerald-700"
        >
          مشاهده
        </button>
        )
      </span>
    </label>
    {error && (
      <p className="text-red-500 text-xs mt-1 font-[iranSans-r] flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);