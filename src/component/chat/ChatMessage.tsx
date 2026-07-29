"use client";

import { useState, useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";

export interface Message {
  id: string;
  sender: "student" | "advisor";
  text: string;
  typing?: number;
  time?: string;
  status?: "sending" | "sent" | "read";
  isVisible?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(message.isVisible ?? false);
  const isAdvisor = message.sender === "advisor";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 30);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex items-end gap-2 transition-all duration-300 ease-out transform font-['iranSans-r'] ${
        isAdvisor ? "justify-start" : "justify-end"
      } ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      {/* آواتار مشاور */}
      {isAdvisor && (
        <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
          👨‍🏫
        </div>
      )}

      {/* حباب پیام */}
      <div
        className={`max-w-[80%] sm:max-w-[72%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative leading-relaxed pb-6 transition-all ${
          isAdvisor
            ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-br-none border border-[var(--color-border)]"
            : "bg-[var(--color-secondary)] text-[var(--color-text-invert)] rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-line text-xs sm:text-sm leading-6">
          {message.text}
        </p>

        {/* زمان و وضعیت ارسال */}
        <div
          className={`absolute bottom-1 flex items-center gap-1 text-[10px] opacity-70 select-none font-['iranBold'] ${
            isAdvisor
              ? "left-3 text-[var(--color-text-secondary)]"
              : "left-3 text-[var(--color-text-invert)]"
          }`}
          dir="ltr"
        >
          <span>{message.time}</span>

          {!isAdvisor && (
            <CheckCheck className="w-3 h-3 text-[var(--color-text-invert)] opacity-80" />
          )}

          {isAdvisor && (
            <span>
              {message.status === "sending" && (
                <span className="animate-pulse">...</span>
              )}
              {message.status === "sent" && (
                <Check className="w-3 h-3 text-[var(--color-text-secondary)]" />
              )}
              {message.status === "read" && (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* آواتار دانش‌آموز */}
      {!isAdvisor && (
        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
          👨‍🎓
        </div>
      )}
    </div>
  );
}