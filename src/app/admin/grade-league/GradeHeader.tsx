import { Award } from "lucide-react";

export default function GradeHeader() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">
          مدیریت لیگ علمی پایه
        </h1>
        <p className="text-xs text-slate-500 font-[iranSans-r]">
          تعریف دانش‌آموز جدید و تیک زدن فعالیت‌های انجام‌شده برای محاسبه آنلاین امتیازات
        </p>
      </div>
      <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-2xl border border-teal-200">
        <Award className="w-5 h-5" />
        <span className="text-sm font-bold">پنل ادمین ثبت نمرات</span>
      </div>
    </div>
  );
}