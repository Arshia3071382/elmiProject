// Student item component
import { User, CheckCircle2 } from "lucide-react";
import { IStudentResult, toPersianDigits } from "./constants";

interface StudentItemProps {
  student: IStudentResult;
  onSelect: (student: IStudentResult) => void;
}

export default function StudentItem({ student, onSelect }: StudentItemProps) {
  return (
    <div
      onClick={() => onSelect(student)}
      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer bg-white shadow-2xs"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            {student.firstName} {student.lastName}
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            کد ملی: {toPersianDigits(student.nationalId)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {student.isCompleted && student.rank ? (
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
            رتبه: {toPersianDigits(student.rank)}
          </span>
        ) : null}

        <div className="text-left">
          <span className="text-[10px] text-slate-400 block font-[iranSans-r]">
            درصد کل
          </span>
          <span className="text-sm font-black text-emerald-700 font-mono">
            {toPersianDigits(student.totalPercentage)}%
          </span>
        </div>

        <div>
          {student.isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
          )}
        </div>
      </div>
    </div>
  );
}