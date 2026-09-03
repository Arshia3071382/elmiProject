"use client";

import { AlertTriangle, X } from "lucide-react";
import { toPersianDigits } from "./constants";

interface IStudent {
  firstName: string;
  lastName: string;
  nationalId?: string;
}

interface DeleteConfirmModalProps {
  student: IStudent | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  student,
  deleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-6 border border-slate-100 relative">
        {/* دکمه بستن بالا */}
        <button
          onClick={onClose}
          disabled={deleting}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* آیکون و هشدار */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">
              تایید حذف دانش‌آموز
            </h3>
            <p className="text-sm text-slate-500 font-[IRANSansXFaNum-Regular]">
              آیا از حذف{" "}
              <span className="font-bold text-slate-700">
                {student.firstName} {student.lastName}
              </span>{" "}
              اطمینان دارید؟
            </p>
          </div>

          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-3 text-xs text-red-600 font-[IRANSansXFaNum-Regular]">
            ⚠️ این عملیات غیرقابل بازگشت است و تمام امتیازات و اطلاعات ثبت‌شده این دانش‌آموز پاک خواهد شد.
          </div>
        </div>

        {/* دکمه‌های عملیات */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-bold transition shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>در حال حذف...</span>
              </>
            ) : (
              "بله، حذف شود"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}