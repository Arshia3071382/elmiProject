"use client";

import { ArrowRight, Search } from "lucide-react";
import { toPersianDigits } from "./constants";

interface ExamHeaderProps {
  title: string;
  studentCount: number;
  searchTerm: string;
  onBack: () => void;
  onSearchChange: (value: string) => void;
}

export default function ExamHeader({
  title,
  studentCount,
  searchTerm,
  onBack,
  onSearchChange,
}: ExamHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800">{title}</h2>
          <span className="text-xs text-slate-400 font-[iranSans-r]">
            مدیریت نمرات و کارنامه • کل دانش‌آموزان: {toPersianDigits(studentCount)} نفر
          </span>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="جستجوی نام یا کد ملی..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-[iranSans-r] focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
}