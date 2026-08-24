// Copy toast notification
"use client";

import { CheckCircle } from "lucide-react";

interface CopyToastProps {
  show: boolean;
}

export default function CopyToast({ show }: CopyToastProps) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
        show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium text-sm" style={{ fontFamily: "iranSans-r" }}>
          آیدی پشتیبانی با موفقیت کپی شد!
        </span>
      </div>
    </div>
  );
}