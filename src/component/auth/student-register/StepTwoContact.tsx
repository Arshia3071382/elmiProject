import React from "react";
import { CreditCard, Phone } from "lucide-react";

interface Props {
  formData: { nationalId: string; phone: string };
  errors: Record<string, string>;
  updateField: (field: string, value: string) => void;
}

export const StepTwoContact: React.FC<Props> = ({ formData, errors, updateField }) => (
  <div className="space-y-3.5">
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">کد ملی (۱۰ رقم)</label>
      <div className="relative">
        <CreditCard className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
        <input
          type="text"
          maxLength={10}
          value={formData.nationalId}
          onChange={(e) => updateField("nationalId", e.target.value)}
          placeholder="0012345678"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
        />
      </div>
      {errors.nationalId && <p className="text-rose-500 text-[11px] mt-0.5">{errors.nationalId}</p>}
    </div>
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">شماره همراه</label>
      <div className="relative">
        <Phone className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
        <input
          type="text"
          maxLength={11}
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="09123456789"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 dir-ltr text-right focus:outline-none focus:border-emerald-500"
        />
      </div>
      {errors.phone && <p className="text-rose-500 text-[11px] mt-0.5">{errors.phone}</p>}
    </div>
  </div>
);