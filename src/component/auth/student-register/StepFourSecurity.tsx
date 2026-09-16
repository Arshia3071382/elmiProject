import React from "react";
import { KeyRound, Trophy } from "lucide-react";

interface Props {
  formData: { securityPin: string; favoritePlayer: string; acceptRules: boolean };
  errors: Record<string, string>;
  updateField: (field: string, value: string | boolean) => void;
  onOpenRules: () => void;
}

export const StepFourSecurity: React.FC<Props> = ({ formData, errors, updateField, onOpenRules }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">۱. یک کد ۶ رقمی شخصی و محرمانه (فقط عدد)</label>
      <div className="relative">
        <KeyRound className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
        <input
          type="text"
          maxLength={6}
          value={formData.securityPin}
          onChange={(e) => updateField("securityPin", e.target.value)}
          placeholder="مثال: ۷۴۸۵۱۲"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
        />
      </div>
      {errors.securityPin && <p className="text-rose-500 text-[11px] mt-0.5">{errors.securityPin}</p>}
    </div>

    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">۲. سه حرف اول اسم بازیکن فوتبال مورد علاقه (فقط انگلیسی)</label>
      <div className="relative">
        <Trophy className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
        <input
          type="text"
          maxLength={3}
          value={formData.favoritePlayer}
          onChange={(e) => updateField("favoritePlayer", e.target.value)}
          placeholder="مثال: ron یا mes"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right uppercase focus:outline-none focus:border-emerald-500"
        />
      </div>
      {errors.favoritePlayer && <p className="text-rose-500 text-[11px] mt-0.5">{errors.favoritePlayer}</p>}
    </div>

    <div className="flex items-center gap-2 pt-1">
      <input
        type="checkbox"
        id="rules"
        checked={formData.acceptRules}
        onChange={(e) => updateField("acceptRules", e.target.checked)}
        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
      />
      <label htmlFor="rules" className="text-xs text-slate-600 cursor-pointer">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onOpenRules();
          }}
          className="text-emerald-600 font-bold hover:underline inline mx-1 cursor-pointer"
        >
          قوانین و شرایط استفاده از سامانه
        </button>
        را مطالعه کرده‌ام و می‌پذیرم.
      </label>
    </div>
    {errors.rules && <p className="text-rose-500 text-[11px]">{errors.rules}</p>}
  </div>
);