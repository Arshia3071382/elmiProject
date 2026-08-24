// Student form component
import { Plus, RefreshCw, UserPlus } from "lucide-react";
import { GRADES } from "./constants";

interface StudentFormProps {
  name: string;
  grade: number;
  creating: boolean;
  onNameChange: (value: string) => void;
  onGradeChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StudentForm({
  name,
  grade,
  creating,
  onNameChange,
  onGradeChange,
  onSubmit,
}: StudentFormProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-fit">
      <div className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
        <UserPlus className="w-5 h-5 text-teal-600" />
        <span>تعریف دانش‌آموز جدید</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 font-[iranSans-r]">
            نام و نام خانوادگی:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="مثال: علی محمدی"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-[iranSans-r]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 font-[iranSans-r]">
            پایه تحصیلی:
          </label>
          <select
            value={grade}
            onChange={(e) => onGradeChange(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-[iranSans-r]"
          >
            {GRADES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          {creating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          افزودن به لیگ
        </button>
      </form>
    </div>
  );
}