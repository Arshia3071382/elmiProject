// Grade selection component
import { GraduationCap, ChevronLeft } from "lucide-react";
import { GRADES, toPersianDigits } from "./constants";

interface GradeSelectorProps {
  onSelectGrade: (gradeId: number) => void;
}

export default function GradeSelector({ onSelectGrade }: GradeSelectorProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 border border-emerald-200 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          مدیریت لیگ علمی پایه
        </h1>
        <p className="text-slate-500 text-sm font-[IRANSansXFaNum-Regular]">
          جهت ثبت دانش‌آموز جدید یا درج امتیازات، ابتدا پایه تحصیلی مورد نظر را انتخاب کنید:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {GRADES.map((g) => (
          <div
            key={g.id}
            onClick={() => onSelectGrade(g.id)}
            className="group cursor-pointer bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm">
                {toPersianDigits(g.id)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {g.label}
                </h3>
                <span className="text-[11px] text-slate-400 font-[IRANSansXFaNum-Regular]">
                  ورود به مدیریت
                </span>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:-translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}