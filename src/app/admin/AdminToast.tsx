// Toast notification component
"use client";

import { Message } from "./constants";

interface AdminToastProps {
  message: Message | null;
}

export default function AdminToast({ message }: AdminToastProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl shadow-lg z-50 text-white font-bold text-xs sm:text-sm ${
        message.type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message.text}
    </div>
  );
}