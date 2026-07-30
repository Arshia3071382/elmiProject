"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, CheckCheck, ChevronLeft } from "lucide-react";

export interface ChatOption {
  id: string;
  label: string;
  nextResponseText?: string;
}

export interface Message {
  id: string;
  sender: "student" | "advisor";
  text: string;
  typing?: number;
  time?: string;
  status?: "sending" | "sent" | "read";
  isVisible?: boolean;
  options?: ChatOption[];
}

interface ChatMessageProps {
  message: Message;
  onSelectOption?: (option: ChatOption) => void;
}

export default function ChatMessage({ message, onSelectOption }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(message.isVisible ?? false);
  const isAdvisor = message.sender === "advisor";
  const hasOptions = isAdvisor && message.options && message.options.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 30);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col gap-2 transition-all duration-300 ease-out transform font-['iranSans-r'] w-full ${
        isAdvisor ? "items-start" : "items-end"
      } ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      {/* Message bubble with avatar */}
      <div
        className={`flex items-end gap-2 w-full ${
          isAdvisor ? "justify-start" : "justify-end"
        }`}
      >
        {/* Advisor avatar */}
        {isAdvisor && (
          <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
            👨‍🏫
          </div>
        )}

        {/* Message bubble container - now using flex-col to stack bubble + options */}
        <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
          {/* The bubble itself */}
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm relative leading-relaxed pb-6 transition-all ${
              isAdvisor
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-br-none border border-[var(--color-border)]"
                : "bg-[var(--color-secondary)] text-[var(--color-text-invert)] rounded-bl-none"
            }`}
          >
            <p className="whitespace-pre-line text-xs sm:text-sm leading-6">
              {message.text}
            </p>

            {/* Timestamp and status */}
            <div
              className={`absolute bottom-1 flex items-center gap-1 text-[10px] opacity-70 select-none font-['iranBold'] ${
                isAdvisor
                  ? "left-3 text-[var(--color-text-secondary)]"
                  : "left-3 text-[var(--color-text-invert)]"
              }`}
              dir="ltr"
            >
              <span>{message.time || "12:00"}</span>

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
                  {(message.status === "read" || !message.status) && (
                    <CheckCheck className="w-3 h-3 text-blue-500" />
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Options section - directly below the bubble with natural spacing */}
          {hasOptions && (
            <div className="mt-2 w-full">
              <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border-2 border-blue-400/50 dark:border-blue-600/50 p-3 shadow-lg backdrop-blur-sm">
                <p className="text-[11px] font-['iranBold'] text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  لطفاً یکی از گزینه‌های زیر را انتخاب کنید:
                </p>
                <div className="flex flex-col gap-2">
                  {message.options!.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => onSelectOption?.(option)}
                      className="w-full text-right p-3 rounded-xl bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-xs font-['iranBold'] transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 min-w-[24px] rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[11px] font-bold group-hover:bg-white/30 group-hover:text-white transition-colors">
                          {index + 1}
                        </span>
                        <span className="truncate">{option.label}</span>
                      </span>
                      <ChevronLeft className="w-4 h-4 min-w-[16px] opacity-30 group-hover:opacity-100 group-hover:translate-x-[-4px] transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student avatar */}
        {!isAdvisor && (
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
            👨‍🎓
          </div>
        )}
      </div>
    </div>
  );
}