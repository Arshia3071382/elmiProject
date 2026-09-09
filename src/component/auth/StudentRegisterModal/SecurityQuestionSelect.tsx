// components/auth/StudentRegisterModal/SecurityQuestionSelect.tsx
"use client";

import { HelpCircle } from "lucide-react";

interface SecurityQuestionSelectProps {
  value: string;
  onChange: (value: string) => void;
  questions: string[];
}

export const SecurityQuestionSelect = ({
  value,
  onChange,
  questions,
}: SecurityQuestionSelectProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-slate-700 font-[iranBold]">
      انتخاب سوال محرمانه بازیابی رمز
    </label>
    <div className="relative">
      <HelpCircle className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 pr-12 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-[iranSans-r] text-slate-700 appearance-none cursor-pointer"
      >
        <option value="">یک سوال انتخاب کنید...</option>
        {questions.map((q, idx) => (
          <option key={idx} value={q}>
            {q}
          </option>
        ))}
      </select>
    </div>
  </div>
);