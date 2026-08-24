import { Trash2 } from "lucide-react";
import { IExamSubject, toPersianDigits } from "./constants";

interface SubjectCardProps {
  subject: IExamSubject;
  index: number;
  isEditing: boolean;
  onRemove: (index: number) => void;
  onSubjectChange: (index: number, field: keyof IExamSubject, value: number) => void;
}

export default function SubjectCard({
  subject,
  index,
  isEditing,
  onRemove,
  onSubjectChange,
}: SubjectCardProps) {
  return (
    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 relative group">
      <div className="flex items-center justify-between">
        <div className="font-bold text-slate-800 text-sm">{subject.subjectName}</div>
        {isEditing && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-rose-500 hover:text-rose-700 p-1 bg-rose-50 rounded-lg cursor-pointer"
            title="حذف این درس"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">کل سوالات</label>
            <input
              type="number"
              value={subject.totalQuestions}
              onChange={(e) => onSubjectChange(index, "totalQuestions", Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-amber-700 block mb-0.5">ضریب</label>
            <input
              type="number"
              step="0.5"
              value={subject.coefficient}
              onChange={(e) => onSubjectChange(index, "coefficient", Number(e.target.value))}
              className="w-full bg-amber-50 border border-amber-300 rounded-lg p-1.5 text-xs text-center font-bold text-amber-900"
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>کل سوالات: <strong className="text-slate-800">{toPersianDigits(subject.totalQuestions)}</strong></span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">ضریب: {toPersianDigits(subject.coefficient)}</span>
        </div>
      )}
    </div>
  );
}