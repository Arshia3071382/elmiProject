// Chat footer component
import { RefreshCw, ChevronUp } from "lucide-react";
import { IOption, IQuestion } from "./constants";

interface ChatFooterProps {
  isFinished: boolean;
  isTyping: boolean;
  activeOptions: IOption[];
  isModalOpen: boolean;
  selectedQuestion: IQuestion | null;
  onRestart: () => void;
  onOpenModal: () => void;
}

export default function ChatFooter({
  isFinished,
  isTyping,
  activeOptions,
  isModalOpen,
  selectedQuestion,
  onRestart,
  onOpenModal,
}: ChatFooterProps) {
  return (
    <div className="p-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] min-h-[55px] flex items-center justify-between px-5 shrink-0">
      {isFinished ? (
        <div className="w-full flex items-center justify-between">
          <span className="text-xs font-['iranBold'] text-[var(--color-success)] flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[var(--color-success)] rounded-full animate-pulse"></span>
            تمام سوالات پاسخ داده شدند ✅
          </span>
          <button
            onClick={onRestart}
            className="text-xs text-[var(--color-secondary)] font-['iranBold'] hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            شروع مجدد
          </button>
        </div>
      ) : isTyping ? (
        <span className="text-xs text-[var(--color-text-secondary)] w-full text-center">
          مشاور در حال پاسخگویی...
        </span>
      ) : activeOptions.length > 0 && !isModalOpen ? (
        <button
          onClick={onOpenModal}
          className="w-full py-2.5 px-4 bg-[var(--color-secondary)] text-[var(--color-text-invert)] hover:opacity-90 active:scale-[0.99] rounded-2xl text-xs font-['iranBold'] flex items-center justify-center gap-2 transition-all shadow-md animate-bounce"
        >
          <span>
            ادامه گفتگو / انتخاب سوال بعدی ({activeOptions.length} سوال باقیمانده)
          </span>
          <ChevronUp className="w-4 h-4" />
        </button>
      ) : (
        <span className="text-xs text-[var(--color-text-secondary)] w-full text-center">
          {selectedQuestion ? "پایان پیام‌ها" : "منتظر انتخاب موضوع..."}
        </span>
      )}
    </div>
  );
}