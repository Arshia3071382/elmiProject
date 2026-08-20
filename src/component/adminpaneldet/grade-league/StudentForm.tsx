// New student form
import { Plus, RefreshCw, UserPlus } from "lucide-react";
import { GRADES, toPersianDigits } from "./constants";

interface StudentFormProps {
  gradeId: number;
  firstName: string;
  lastName: string;
  nationalId: string;
  creating: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onNationalIdChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StudentForm({
  gradeId,
  firstName,
  lastName,
  nationalId,
  creating,
  onFirstNameChange,
  onLastNameChange,
  onNationalIdChange,
  onSubmit,
}: StudentFormProps) {
  const gradeLabel = GRADES.find((g) => g.id === gradeId)?.label;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
      <div className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
        <UserPlus className="w-5 h-5 text-emerald-600" />
        <span>ثبت دانش‌آموز جدید</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
            نام:
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="مثال: محمدجواد"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
            نام خانوادگی:
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="مثال: ابراهیمی"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
            کد ملی:
          </label>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => onNationalIdChange(e.target.value)}
            placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
            maxLength={10}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
            required
          />
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-[IRANSansXFaNum-Regular]">
          ثبت در: <strong className="font-bold">{gradeLabel}</strong>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          {creating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          افزودن دانش‌آموز
        </button>
      </form>
    </div>
  );
}