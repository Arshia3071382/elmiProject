'use client';

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IOption } from "./constants";

interface OptionModalProps {
  options: IOption[];
  onSelect: (option: IOption) => void;
  onClose?: () => void;
}

export default function OptionModal({ options, onSelect, onClose }: OptionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('pwaModalToggle', { detail: { isOpen: true } })
      );
    }

    // جلوگیری از اسکرول پس‌زمینه در آیفون
    document.body.style.overflow = 'hidden';

    return () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pwaModalToggle', { detail: { isOpen: false } })
        );
      }
      document.body.style.overflow = '';
    };
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[9999999] overflow-hidden bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* کارت مودال - با رعایت Safe Area آیفون */}
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-in slide-in-from-bottom sm:animate-in sm:zoom-in-95 duration-200 flex flex-col border-t border-slate-100 sm:border-none"
        style={{
          paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 20px))',
        }}
      >
        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-secondary)]"></span>
            </span>
            <p className="text-xs font-['iranBold'] text-slate-800">
              لطفاً یک سوال را برای ادامه گفتگو انتخاب کنید:
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-['iranBold'] px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--color-secondary)] border border-blue-100">
              {options.length} سوال باقیمانده
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* لیست سوالات - نمایش حدود ۳ تا ۴ سوال و اسکرول مابقی */}
        <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[220px] sm:max-h-[280px] pr-1 my-1 custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className="w-full text-right bg-slate-50 hover:bg-blue-50/80 text-slate-800 border border-slate-200/80 hover:border-[var(--color-secondary)] p-2.5 rounded-2xl text-xs sm:text-sm font-['iranBold'] transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99] shrink-0"
            >
              <div className="flex items-start gap-2 max-w-[78%]">
                <span className="text-sm leading-none select-none">💬</span>
                <span className="leading-relaxed text-slate-800">{opt.label}</span>
              </div>
              <span className="shrink-0 text-[10px] sm:text-[11px] font-['iranBold'] text-[var(--color-secondary)] bg-white group-hover:bg-[var(--color-secondary)] group-hover:text-white px-2.5 py-1 rounded-xl border border-slate-200 group-hover:border-[var(--color-secondary)] transition-all">
                پاسخ ←
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );

  // رندر در بالاترین لایه DOM جهت جلوگیری از گیر افتادن در Context سافاری
  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}