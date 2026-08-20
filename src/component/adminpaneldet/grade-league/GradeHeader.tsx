// Grade management header
import { ArrowRight } from "lucide-react";
import { GRADES } from "./constants";

interface GradeHeaderProps {
  gradeId: number;
  onBack: () => void;
}

export default function GradeHeader({ gradeId, onBack }: GradeHeaderProps) {
  const gradeLabel = GRADES.find((g) => g.id === gradeId)?.label;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
          title="بازگشت به انتخاب پایه"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            مدیریت {gradeLabel}
          </h2>
          <p className="text-xs text-slate-500 font-[IRANSansXFaNum-Regular] mt-0.5">
            لیست دانش‌آموزان ثبت‌شده و محاسبه نمرات
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
        {GRADES.map((g) => (
          <button
            key={g.id}
            onClick={() => onBack()} // Will be handled differently
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gradeId === g.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}