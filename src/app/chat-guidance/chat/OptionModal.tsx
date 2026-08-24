// Option selection modal
import { IOption } from "./constants";

interface OptionModalProps {
  options: IOption[];
  onSelect: (option: IOption) => void;
}

export default function OptionModal({ options, onSelect }: OptionModalProps) {
  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-lg rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-secondary)]"></span>
            </span>
            <p className="text-xs font-['iranBold'] text-[var(--color-primary)]">
              لطفاً یک سوال را برای ادامه گفتگو انتخاب کنید:
            </p>
          </div>
          <span className="text-[11px] font-['iranBold'] px-2.5 py-0.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20">
            {options.length} سوال باقیمانده
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className="w-full text-right bg-white dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-[var(--color-secondary)] p-3.5 rounded-2xl text-xs sm:text-sm font-['iranBold'] transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <span className="text-base leading-none select-none">💬</span>
                <span className="leading-relaxed">{opt.label}</span>
              </div>
              <span className="shrink-0 text-[11px] font-['iranBold'] text-[var(--color-secondary)] bg-blue-50 dark:bg-slate-800 group-hover:bg-[var(--color-secondary)] group-hover:text-white px-3 py-1.5 rounded-xl border border-blue-100 dark:border-slate-600 transition-all">
                پاسخ ←
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}