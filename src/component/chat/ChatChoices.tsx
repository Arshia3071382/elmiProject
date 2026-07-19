// src/component/chat/ChatChoices.tsx
"use client";

import { useState, useEffect } from "react";

interface Choice {
  id: string;
  text: string;
  next: string;
}

interface ChatChoicesProps {
  choices: Choice[];
  onSelect: (nextSlug: string) => void;
}

export default function ChatChoices({ choices, onSelect }: ChatChoicesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col gap-3 mt-6 transition-all duration-700 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="text-xs text-gray-400 text-center mb-2">
        —————— گزینه‌های پیش رو ——————
      </div>
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => onSelect(choice.next)}
          className="w-full text-right px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent hover:text-white transition-all duration-300 group flex items-center gap-3 shadow-sm hover:shadow-md"
        >
          <span className="font-medium text-sm md:text-base">{choice.text}</span>
          <span className="mr-auto text-gray-400 group-hover:text-white transition-colors">
            ←
          </span>
        </button>
      ))}
    </div>
  );
}