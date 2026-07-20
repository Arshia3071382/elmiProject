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
      className={`flex items-end gap-2 transition-all duration-300 ease-out transform ${
        isAdvisor ? "justify-start" : "justify-end"
      } ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}`}
    >
      {isAdvisor && (
        <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
          👨‍🏫
        </div>
      )}

      <div
        className={`max-w-[78%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative leading-relaxed pb-6 transition-all ${
          isAdvisor
            ? "bg-surface text-text-primary rounded-bl-none border border-border"
            : "bg-secondary text-white rounded-br-none"
        }`}
      >
        <p className="whitespace-pre-line text-xs sm:text-sm">{message.text}</p>

        <div className="absolute bottom-1 left-3 flex items-center gap-1 text-[9px] opacity-60 select-none dir-ltr">
          <span>{message.time}</span>
          {!isAdvisor && <CheckCheck className="w-2.5 h-2.5 opacity-70" />}
          {isAdvisor && (
            <span>
              {message.status === "sending" && <span className="animate-pulse">...</span>}
              {message.status === "sent" && <Check className="w-2.5 h-2.5 text-gray-400" />}
              {message.status === "read" && <CheckCheck className="w-2.5 h-2.5 text-blue-500" />}
            </span>
          )}
        </div>
      </div>

      {!isAdvisor && (
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
          👨‍🎓
        </div>
      )}
    </div>
  );
}