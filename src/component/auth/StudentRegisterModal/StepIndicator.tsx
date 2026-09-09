// components/auth/StudentRegisterModal/StepIndicator.tsx
"use client";

import { motion } from "framer-motion";

interface StepIndicatorProps {
  step: number;
  total?: number;
  steps?: string[];
}

export const StepIndicator = ({ 
  step, 
  total = 4,
  steps = ["اطلاعات فردی", "کد ملی و تماس", "رمز عبور", "امنیت و کلمه شخصی"]
}: StepIndicatorProps) => (
  <div className="mb-6 pt-2">
    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 font-[iranSans-r]">
      <span>مرحله {step} از {total}</span>
      <span>{steps[step - 1]}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </div>
);