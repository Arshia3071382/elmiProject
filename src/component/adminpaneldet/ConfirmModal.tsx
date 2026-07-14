// ConfirmModal.tsx
"use client";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2 text-right">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed text-right">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition flex items-center gap-2"
          >
            {loading ? "در حال حذف..." : "تایید و حذف"}
          </button>
        </div>
      </div>
    </div>
  );
}