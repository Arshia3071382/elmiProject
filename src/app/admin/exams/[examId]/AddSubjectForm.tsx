// Add subject form component
import { Plus } from "lucide-react";

interface AddSubjectFormProps {
  name: string;
  total: number | "";
  coefficient: number | "";
  onNameChange: (value: string) => void;
  onTotalChange: (value: number | "") => void;
  onCoefficientChange: (value: number | "") => void;
  onAdd: () => void;
}

export default function AddSubjectForm({
  name,
  total,
  coefficient,
  onNameChange,
  onTotalChange,
  onCoefficientChange,
  onAdd,
}: AddSubjectFormProps) {
  return (
    <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row items-end gap-3 pt-4">
      <div className="w-full sm:flex-1">
        <label className="text-[11px] text-emerald-900 font-bold block mb-1">نام درس جدید</label>
        <input
          type="text"
          placeholder="مثلاً: هدیه‌های آسمان"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-[iranSans-r]"
        />
      </div>
      <div className="w-full sm:w-32">
        <label className="text-[11px] text-emerald-900 font-bold block mb-1">تعداد کل سوالات</label>
        <input
          type="number"
          placeholder="تعداد"
          value={total}
          onChange={(e) => onTotalChange(e.target.value ? Number(e.target.value) : "")}
          className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-center font-bold font-mono"
        />
      </div>
      <div className="w-full sm:w-28">
        <label className="text-[11px] text-emerald-900 font-bold block mb-1">ضریب</label>
        <input
          type="number"
          step="0.5"
          placeholder="ضریب"
          value={coefficient}
          onChange={(e) => onCoefficientChange(e.target.value ? Number(e.target.value) : "")}
          className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-center font-bold font-mono"
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0"
      >
        <Plus className="w-4 h-4" />
        افزودن درس
      </button>
    </div>
  );
}