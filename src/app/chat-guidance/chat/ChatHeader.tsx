import { LogOut } from "lucide-react";
import { ITopic } from "./constants";

interface ChatHeaderProps {
  topic: ITopic;
  onBack: () => void;
}

export default function ChatHeader({ topic, onBack }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)] shrink-0">
      <div>
        <h3 className="font-['iranBold'] text-base text-[var(--color-primary)]">
          {topic.title}
        </h3>
        {topic.description && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {topic.description}
          </p>
        )}
      </div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-100 transition font-['iranBold']"
      >
        <LogOut className="w-3.5 h-3.5" />
        خروج
      </button>
    </div>
  );
}