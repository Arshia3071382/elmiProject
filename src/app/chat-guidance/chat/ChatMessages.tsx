// Chat messages component
import { forwardRef } from "react";
import ChatMessage from "./../../../component/chat/ChatMessage";
import TypingIndicator from "./../../../component/chat/TypingIndicator";
import { ChatMessageType } from "./constants";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  hasSelectedQuestion: boolean;
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, isTyping, hasSelectedQuestion }, ref) => {
    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[var(--color-bg)] min-h-[350px]"
      >
        {!hasSelectedQuestion && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl flex items-center justify-center mb-3 text-[var(--color-secondary)] font-['iranBold'] text-2xl shadow-sm">
              💬
            </div>
            <p className="text-sm text-[var(--color-text-primary)] font-['iranBold']">
              یک موضوع را از بالا انتخاب کنید
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;