// Activity score modal
import { X, Save, RefreshCw, Search, Sparkles } from "lucide-react";
import { GRADES, toPersianDigits } from "./constants";
import { LEAGUE_ACTIVITIES, calculateTotalScore } from "./../../../../lib/leagueActivities";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  grade: number;
}

interface ActivityModalProps {
  student: Student | null;
  activeCheckboxes: string[];
  searchActivity: string;
  saving: boolean;
  onClose: () => void;
  onToggleActivity: (id: string) => void;
  onSearchChange: (value: string) => void;
  onSave: () => void;
}

export default function ActivityModal({
  student,
  activeCheckboxes,
  searchActivity,
  saving,
  onClose,
  onToggleActivity,
  onSearchChange,
  onSave,
}: ActivityModalProps) {
  if (!student) return null;

  // Group activities by category
  const groupedActivities = LEAGUE_ACTIVITIES.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof LEAGUE_ACTIVITIES>);

  const liveCalculatedScore = calculateTotalScore(activeCheckboxes);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                افزودن فعالیت و امتیاز: {student.firstName} {student.lastName}
              </h3>
              <p className="text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
                مقطع: {GRADES.find((g) => g.id === student.grade)?.label} | کد ملی: {toPersianDigits(student.nationalId || "")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search and score */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="جستجوی عنوان فعالیت..."
              value={searchActivity}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-[IRANSansXFaNum-Regular] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-emerald-200 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-slate-600 font-[IRANSansXFaNum-Regular]">
              امتیاز اضافه شونده:
            </span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              {toPersianDigits(liveCalculatedScore)}
            </span>
          </div>
        </div>

        {/* Activities list */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {Object.entries(groupedActivities).map(([category, items]) => {
            const filteredItems = items.filter((i) =>
              i.title.includes(searchActivity)
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h4 className="text-xs font-black text-emerald-800 bg-emerald-100/60 px-3 py-1.5 rounded-lg w-fit">
                  {category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredItems.map((act) => {
                    const isChecked = activeCheckboxes.includes(act.id);
                    return (
                      <label
                        key={act.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleActivity(act.id)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-[IRANSansXFaNum-Regular]">{act.title}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                            act.score < 0
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {act.score > 0
                            ? `+${toPersianDigits(act.score)}`
                            : toPersianDigits(act.score)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors font-[IRANSansXFaNum-Regular]"
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            ذخیره امتیازات
          </button>
        </div>
      </div>
    </div>
  );
}