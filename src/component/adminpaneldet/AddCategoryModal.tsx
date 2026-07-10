import React from "react";
import { FolderPlus } from "lucide-react";

interface ModalProps { isOpen: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void; name: string; onNameChange: (val: string) => void; }

export default function AddCategoryModal({ isOpen, onClose, onSubmit, name, onNameChange }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6"><div className="bg-green-100 p-2 rounded-xl"><FolderPlus className="w-6 h-6 text-green-600" /></div><h3 className="text-xl font-bold text-gray-800">گروه جدید</h3></div>
        <form onSubmit={onSubmit}>
          <div className="mb-6"><label className="block text-gray-700 font-medium mb-2 text-sm">نام گروه</label><input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="مثال: آموزش پایتون" autoFocus /></div>
          <div className="flex gap-3"><button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium text-sm transition">ایجاد گروه</button><button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm transition">انصراف</button></div>
        </form>
      </div>
    </div>
  );
}