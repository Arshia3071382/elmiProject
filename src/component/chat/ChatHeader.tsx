// src/component/chat/ChatHeader.tsx
"use client";

interface ChatHeaderProps {
  title: string;
  onBack: () => void;
}

export default function ChatHeader({ title, onBack }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
      <button
        onClick={onBack}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="بازگشت"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
          
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800 text-sm md:text-base">
            {title}
          </h2>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs text-gray-500">آنلاین</p>
          </div>
        </div>
      </div>
    </div>
  );
}