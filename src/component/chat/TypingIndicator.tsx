// src/component/chat/TypingIndicator.tsx
"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-xl">🧑‍🏫</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}