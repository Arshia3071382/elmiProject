import { IQuestion } from "./constants";

interface QuestionButtonsProps {
  questions: IQuestion[];
  selectedQuestion: IQuestion | null;
  onSelect: (q: IQuestion) => void;
}

export default function QuestionButtons({
  questions,
  selectedQuestion,
  onSelect,
}: QuestionButtonsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto p-3.5 border-b border-[var(--color-border)] bg-[var(--color-bg)] scrollbar-hide shrink-0">
      {questions.length > 0 ? (
        questions.map((q, idx) => {
          const isSelected = selectedQuestion?.id === q.id || selectedQuestion?.title === q.title;
          return (
            <button
              key={q.id || `q-${idx}`}
              onClick={() => onSelect(q)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-['iranBold'] whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-[var(--color-secondary)] text-[var(--color-text-invert)] shadow-lg shadow-blue-500/20 scale-105"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)]"
              }`}
            >
              {q.title}
            </button>
          );
        })
      ) : (
        <div className="text-xs text-[var(--color-text-secondary)] py-1 px-2">
          هیچ موضوعی برای این تاپیک ثبت نشده است
        </div>
      )}
    </div>
  );
}