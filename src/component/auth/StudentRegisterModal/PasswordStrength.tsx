// Password strength indicator
"use client";

import { getPasswordStrength } from "./constants";

interface PasswordStrengthProps {
  password: string;
  error?: string;
}

export default function PasswordStrength({ password, error }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  if (!password || error) return null;

  return (
    <div className="flex items-center gap-2 mt-1.5 px-1">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            strength.label.includes("کوتاه")
              ? "w-1/3 bg-red-500"
              : strength.label.includes("متوسط")
              ? "w-2/3 bg-amber-500"
              : "w-full bg-emerald-500"
          }`}
        />
      </div>
      <span className={`text-[11px] font-bold ${strength.color}`}>
        {strength.label}
      </span>
    </div>
  );
}