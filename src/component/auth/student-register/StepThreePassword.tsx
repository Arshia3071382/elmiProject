import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface Props {
  formData: { password: string; confirmPassword: string };
  errors: Record<string, string>;
  updateField: (field: string, value: string) => void;
}

export const StepThreePassword: React.FC<Props> = ({ formData, errors, updateField }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          رمز عبور (۶ تا ۸ کاراکتر، شامل حروف بزرگ، کوچک و عدد)
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="Abc123"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-10 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-rose-500 text-[11px] mt-0.5">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">تکرار رمز عبور</label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder="Abc123"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-10 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-rose-500 text-[11px] mt-0.5">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
};