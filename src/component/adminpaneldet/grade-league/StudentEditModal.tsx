// Edit student modal
import { X, Save, RefreshCw } from "lucide-react";

interface StudentEditModalProps {
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    nationalId: string;
  } | null;
  firstName: string;
  lastName: string;
  nationalId: string;
  saving: boolean;
  onClose: () => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onNationalIdChange: (value: string) => void;
  onSave: () => void;
}

export default function StudentEditModal({
  student,
  firstName,
  lastName,
  nationalId,
  saving,
  onClose,
  onFirstNameChange,
  onLastNameChange,
  onNationalIdChange,
  onSave,
}: StudentEditModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">
            ویرایش اطلاعات دانش‌آموز
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
              نام:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
              نام خانوادگی:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
              کد ملی:
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => onNationalIdChange(e.target.value)}
              maxLength={10}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
            />
          </div>
        </div>

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
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}