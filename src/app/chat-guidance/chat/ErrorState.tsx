import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string | null;
  onBack: () => void;
}

export default function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-[60vh] text-center p-6 font-['iranSans-r']"
      dir="rtl"
    >
      <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
      <h3 className="font-['iranBold'] text-lg mb-2 text-[var(--color-text-primary)]">
        خطا در بارگذاری
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        {error || "تاپیک یافت نشد"}
      </p>
      <button
        onClick={onBack}
        className="px-6 py-2.5 bg-[var(--color-secondary)] text-[var(--color-text-invert)] rounded-xl text-sm font-['iranBold'] hover:opacity-90 transition shadow-md"
      >
        بازگشت به تاپیک‌ها
      </button>
    </div>
  );
}