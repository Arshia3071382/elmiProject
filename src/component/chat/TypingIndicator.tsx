"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start transition-opacity duration-200 my-2">
      <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
        👨‍🏫
      </div>
      <div className="bg-surface rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-border flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}