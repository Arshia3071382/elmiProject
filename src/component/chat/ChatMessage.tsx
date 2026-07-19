// src/component/chat/ChatMessage.tsx
"use client";

import { useState, useEffect } from "react";

interface MessageProps {
  message: {
    id: string;
    sender: "student" | "advisor";
    type: string;
    text?: string;
    delay?: number;
    typing?: number;
    showTicks?: boolean;
  };
  isStudent: boolean;
}

export default function ChatMessage({ message, isStudent }: MessageProps) {
  const [showFirstTick, setShowFirstTick] = useState(false);
  const [showSecondTick, setShowSecondTick] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    if (message.showTicks && !isStudent) {
      const tick1Timer = setTimeout(() => {
        if (isMounted) setShowFirstTick(true);
      }, 300);

      const tick2Timer = setTimeout(() => {
        if (isMounted) setShowSecondTick(true);
      }, 500);

      return () => {
        clearTimeout(tick1Timer);
        clearTimeout(tick2Timer);
      };
    }

    return () => clearTimeout(timer);
  }, [isMounted, isStudent, message.showTicks]);

  if (!isMounted) return null;

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-start gap-3 mb-4 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isStudent ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full overflow-hidden ${
          isStudent ? "bg-blue-100" : "bg-accent/10"
        } flex items-center justify-center`}>
          {isStudent ? (
            <span className="text-xl">👨‍🎓</span>
          ) : (
            <span className="text-xl">🧑‍🏫</span>
          )}
        </div>
      </div>

      <div className={`max-w-[70%] ${isStudent ? "items-start" : "items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isStudent
              ? "bg-white text-gray-800 shadow-sm"
              : "bg-accent text-white"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>

        <div className="flex items-center gap-0.5 mt-1 text-xs text-gray-400 justify-end">
          {!isStudent && message.showTicks && (
            <>
              <span
                className={`transition-opacity duration-300 ${
                  showFirstTick ? "opacity-100" : "opacity-0"
                }`}
              >
                ✓
              </span>
              <span
                className={`transition-opacity duration-300 ${
                  showSecondTick ? "opacity-100 text-blue-500" : "opacity-0"
                }`}
              >
                ✓
              </span>
            </>
          )}
          <span className="mr-1">{getTime()}</span>
        </div>
      </div>
    </div>
  );
}