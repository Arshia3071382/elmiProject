// src/app/chat-guidance/page.tsx
import { Suspense } from "react";
import ChatContainer from "@/component/chat/ChatContainer";

export const metadata = {
  title: "گفتینو | مشاوره انتخاب رشته",
  description: "مکالمات هوشمند برای انتخاب رشته تحصیلی",
};

export default function ChatGuidancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      }>
        <ChatContainer />
      </Suspense>
    </div>
  );
}