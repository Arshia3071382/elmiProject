import React from "react";
import { User } from "lucide-react";

interface Props {
  formData: { firstName: string; lastName: string };
  errors: Record<string, string>;
  updateField: (field: string, value: string | boolean) => void;
}

export const StepOnePersonal: React.FC<Props> = ({ formData, errors, updateField }) => (
  <div className="space-y-3.5">
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">نام</label>
      <div className="relative">
        <User className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          placeholder="مثال: علی"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
        />
      </div>
      {errors.firstName && <p className="text-rose-500 text-[11px] mt-0.5">{errors.firstName}</p>}
    </div>
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">نام خانوادگی</label>
      <div className="relative">
        <User className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          placeholder="مثال: محمدی"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
        />
      </div>
      {errors.lastName && <p className="text-rose-500 text-[11px] mt-0.5">{errors.lastName}</p>}
    </div>
  </div>
);