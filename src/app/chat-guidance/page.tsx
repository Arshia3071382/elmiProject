// src/app/chat-guidance/page.tsx
import ChatContainer from "@/component/chat/ChatContainer";

export const metadata = {
  title: "گفتینو | مشاوره انتخاب رشته",
  description: "مکالمات هوشمند برای انتخاب رشته تحصیلی",
};

export default function ChatGuidancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ChatContainer />
    </div>
  );
}