// Students ranking table
import { Award, RefreshCw, CheckSquare } from "lucide-react";
import { GRADES, toPersianDigits } from "./constants";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  grade: number;
  selectedActivities: string[];
  totalScore: number;
  published: boolean;
}

interface StudentTableProps {
  students: Student[];
  gradeId: number;
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onOpenModal: (student: Student) => void;
}

export default function StudentTable({
  students,
  gradeId,
  loading,
  onEdit,
  onDelete,
  onOpenModal,
}: StudentTableProps) {
  const gradeLabel = GRADES.find((g) => g.id === gradeId)?.label;

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>جدول رتبه‌بندی {gradeLabel}</span>
        </div>
        <span className="text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
          تعداد: {toPersianDigits(students.length)} نفر
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs font-[IRANSansXFaNum-Regular]">
            در حال بارگذاری اطلاعات جدول...
          </span>
        </div>
      ) : students.length === 0 ? (
        <div className="py-16 text-center text-slate-400 font-[IRANSansXFaNum-Regular] text-sm">
          هنوز دانش‌آموزی برای این پایه ثبت نشده است.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
                <th className="py-3 px-3">رتبه</th>
                <th className="py-3 px-3">نام</th>
                <th className="py-3 px-3">نام خانوادگی</th>
                <th className="py-3 px-3">کد ملی</th>
                <th className="py-3 px-3">پایه</th>
                <th className="py-3 px-3 text-center">تعداد فعالیت</th>
                <th className="py-3 px-3 text-center">امتیاز کل</th>
                <th className="py-3 px-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st, idx) => (
                <tr key={st._id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-500">
                    {toPersianDigits(idx + 1)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {st.firstName || "نامشخص"}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {st.lastName || "نامشخص"}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-xs">
                    {st.nationalId ? toPersianDigits(st.nationalId) : "نامشخص"}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {GRADES.find((g) => g.id === st.grade)?.label || st.grade}
                  </td>
                  <td className="py-3 px-3 text-center text-xs text-slate-500 font-[IRANSansXFaNum-Regular]">
                    {toPersianDigits(st.selectedActivities?.length || 0)} مورد
                  </td>
                  <td className="py-3 px-3 text-center font-black text-emerald-600 text-base">
                    {toPersianDigits(st.totalScore?.toLocaleString() || 0)}
                  </td>
                  <td className="py-3 px-3 text-left">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(st)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-bold transition-all"
                      >
                        ✏️ ویرایش
                      </button>
                      <button
                        onClick={() => onOpenModal(st)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        امتیاز
                      </button>
                      <button
                        onClick={() => onDelete(st._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold transition-all"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}