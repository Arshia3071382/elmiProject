// Student list component
import { CheckSquare, RefreshCw } from "lucide-react";
import { GRADES, Student } from "./constants";

interface StudentListProps {
  students: Student[];
  loading: boolean;
  gradeFilter: number;
  onGradeFilterChange: (grade: number) => void;
  onStudentSelect: (student: Student) => void;
}

export default function StudentList({
  students,
  loading,
  gradeFilter,
  onGradeFilterChange,
  onStudentSelect,
}: StudentListProps) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <CheckSquare className="w-5 h-5 text-teal-600" />
          <span>لیست دانش‌آموزان و تعیین امتیاز</span>
        </div>

        {/* Grade filter */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          {GRADES.map((g) => (
            <button
              key={g.id}
              onClick={() => onGradeFilterChange(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                gradeFilter === g.id
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
          <span className="text-sm font-[iranSans-r]">در حال دریافت لیست...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-[iranSans-r] text-sm">
          هیچ دانش‌آموزی برای این پایه پیدا نشد.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {students.map((st) => (
            <div
              key={st._id}
              onClick={() => onStudentSelect(st)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/30 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {st.name}
                </h4>
                <p className="text-xs text-slate-400 font-[iranSans-r] mt-1">
                  فعالیت‌های ثبت شده: {st.selectedActivities?.length || 0} مورد
                </p>
              </div>
              <div className="text-left">
                <span className="block text-xs text-slate-400 font-[iranSans-r]">امتیاز کل</span>
                <span className="text-lg font-black text-teal-600">{st.totalScore}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}