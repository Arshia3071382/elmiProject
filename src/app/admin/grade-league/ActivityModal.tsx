// Activity modal component
import { X, Save, Search, RefreshCw } from "lucide-react";
import { LEAGUE_ACTIVITIES, calculateTotalScore } from "./../../../../lib/leagueActivities";
import { GRADES } from "./constants";

interface ActivityModalProps {
  student: any | null;
  activeCheckboxes: string[];
  searchActivity: string;
  saving: boolean;
  onClose: () => void;
  onToggle: (id: string) => void;
  onSearchChange: (value: string) => void;
  onSave: () => void;
}

export default function ActivityModal({
  student,
  activeCheckboxes,
  searchActivity,
  saving,
  onClose,
  onToggle,
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">مدیریت فعالیت‌های {student.name}</h3>
            <p className="text-xs text-slate-400 font-[iranSans-r] mt-1">
              پایه تحصیلی: {GRADES.find((g) => g.id === student.grade)?.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Search and score */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="جستجوی فعالیت..."
              value={searchActivity}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-[iranSans-r] focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-3 bg-teal-100/80 text-teal-900 px-4 py-2 rounded-2xl">
            <span className="text-xs font-[iranSans-r]">مجموع امتیاز آنلاین:</span>
            <span className="text-xl font-black text-teal-700">{liveCalculatedScore}</span>
          </div>
        </div>

        {/* Activities list */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {Object.entries(groupedActivities).map(([category, items]) => {
            const filteredItems = items.filter((i) =>
              i.title.includes(searchActivity)
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                  {category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredItems.map((act) => {
                    const isChecked = activeCheckboxes.includes(act.id);
                    return (
                      <label
                        key={act.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? "bg-teal-50/80 border-teal-400 text-teal-950 font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggle(act.id)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                          />
                          <span className="font-[iranSans-r]">{act.title}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                            act.score < 0
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {act.score > 0 ? `+${act.score}` : act.score}
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
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors font-[iranSans-r]"
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            تأیید و ثبت امتیاز
          </button>
        </div>
      </div>
    </div>
  );
}