import { Suspense } from "react";
import ChatContainer from "@/component/chat/ChatContainer";

export const metadata = {
  title: "گفتینو | مشاوره هوشمند انتخاب رشته",
  description: "مکالمات هوشمند هدایت‌شده برای انتخاب رشته تحصیلی",
};

export default function ChatGuidancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <Suspense fallback={
        <div className="flex flex-col h-[85vh] w-full max-w-2xl bg-gray-50 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <ChatContainer />
      </Suspense>
    </div>
  );
}