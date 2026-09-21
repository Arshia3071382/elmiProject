'use client';

import React, { useEffect } from "react";
import { IOption } from "./constants";

interface OptionModalProps {
  options: IOption[];
  onSelect: (option: IOption) => void;
  onClose?: () => void;
}

export default function OptionModal({ options, onSelect, onClose }: OptionModalProps) {
  // ارسال رویداد جهت مخفی/ظاهر کردن Header و BottomNav در LayoutShell
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('pwaModalToggle', { detail: { isOpen: true } })
      );
    }

    // جلوگیری از اسکرول بدنه در آیفون و موبایل
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

  return (
    <div className="fixed inset-0 z-[999999] overflow-hidden bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Card - Fullscreen height on Mobile/iPhone (100dvh) */}
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3 animate-in slide-in-from-bottom sm:animate-in sm:zoom-in-95 duration-200 flex flex-col h-[100dvh] sm:h-auto sm:max-h-[85vh] border-t border-slate-100 sm:border-none justify-between sm:justify-start"
        style={{
          paddingTop: 'calc(1.25rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex flex-col space-y-3 flex-1 overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
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

          {/* Questions List - Scrollable in Mobile */}
          <div className="grid grid-cols-1 gap-2.5 overflow-y-auto flex-1 max-h-none sm:max-h-[360px] pr-1.5 my-1 custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt)}
                className="w-full text-right bg-slate-50 hover:bg-blue-50/80 text-slate-800 border border-slate-200/80 hover:border-[var(--color-secondary)] p-3 rounded-2xl text-xs sm:text-sm font-['iranBold'] transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99] shrink-0"
              >
                <div className="flex items-start gap-2.5 max-w-[78%]">
                  <span className="text-base leading-none select-none">💬</span>
                  <span className="leading-relaxed text-slate-800">{opt.label}</span>
                </div>
                <span className="shrink-0 text-[11px] font-['iranBold'] text-[var(--color-secondary)] bg-white group-hover:bg-[var(--color-secondary)] group-hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 group-hover:border-[var(--color-secondary)] transition-all">
                  پاسخ ←
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}