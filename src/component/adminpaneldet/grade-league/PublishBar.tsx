// Publish changes bar
import { Clock, Save, RefreshCw } from "lucide-react";
import { toPersianDate } from "./constants";

interface PublishBarProps {
  lastUpdate: string | null;
  isPublishing: boolean;
  onPublish: () => void;
}

export default function PublishBar({ lastUpdate, isPublishing, onPublish }: PublishBarProps) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-[IRANSansXFaNum-Regular]">
              آخرین بروزرسانی منتشر شده:
            </p>
            <p className="text-sm font-bold text-slate-800">
              {lastUpdate ? toPersianDate(lastUpdate) : "هنوز بروزرسانی منتشر نشده"}
            </p>
          </div>
        </div>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          اعمال تغییرات و بروزرسانی جدول لیگ
        </button>
      </div>
    </div>
  );
}