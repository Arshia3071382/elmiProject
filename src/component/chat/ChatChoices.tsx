"use client";

import { useState, useEffect } from "react";

interface Choice {
  id?: string;
  text: string;
  next: string;
}

interface ChatChoicesProps {
  choices: Choice[];
  onSelect: (nextSlug: string) => void;
}

export default function ChatChoices({ choices, onSelect }: ChatChoicesProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col gap-2.5 mt-4 w-full transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="text-[11px] text-gray-400 text-center mb-1 select-none">
        — گزینه‌های انتخاب —
      </div>
      <div className="flex flex-wrap gap-2 justify-center w-full">
        {choices.map((choice, index) => (
          <button
            key={choice.id || index}
            onClick={() => onSelect(choice.next)}
            className="w-full sm:w-auto text-right px-4 py-2.5 bg-blue-50/80 hover:bg-blue-100/80 text-secondary font-['iranBold'] border border-blue-100 rounded-xl text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-between gap-3"
          >
            <span>{choice.text}</span>
            <span className="text-gray-400 group-hover:text-secondary transition-colors">←</span>
          </button>
        ))}
      </div>
    </div>
  );
}