"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, LogOut } from "lucide-react";
import ChatMessage from "./../../component/chat/ChatMessage";
import TypingIndicator from "./../../component/chat/TypingIndicator";

interface IMessage {
  sender: "advisor" | "student";
  text: string;
}

interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

interface ITopic {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  questions: IQuestion[];
}

interface ChatMessageType {
  id: string;
  sender: "advisor" | "student";
  text: string;
  time: string;
  status: "read";
  isVisible: boolean;
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicSlug = searchParams.get("t");

  const [topic, setTopic] = useState<ITopic | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeStepRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topicSlug) {
      setError("هیچ تاپیکی انتخاب نشده است.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/chat/topics/${topicSlug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setTopic(res.data);
          setError(null);
        } else {
          setError(res.error || "تاپیک مورد نظر یافت نشد.");
        }
      })
      .catch(() => setError("خطا در دریافت اطلاعات از سرور"))
      .finally(() => setLoading(false));
  }, [topicSlug]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isTyping]);

  const handleSelectQuestion = async (q: IQuestion) => {
    const currentStep = ++activeStepRef.current;
    setSelectedQuestion(q);
    setChatMessages([]);
    setIsFinished(false);

    const msgs = q.messages || [];

    for (let i = 0; i < msgs.length; i++) {
      if (activeStepRef.current !== currentStep) return;

      const msg = msgs[i];

      if (msg.sender === "advisor") {
        setIsTyping(true);
        await sleep(900);
        if (activeStepRef.current !== currentStep) return;
        setIsTyping(false);
      } else {
        await sleep(400);
        if (activeStepRef.current !== currentStep) return;
      }

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      setChatMessages((prev) => [
        ...prev,
        {
          id: `${q.id || i}-${i}-${Date.now()}`,
          sender: msg.sender,
          text: msg.text,
          time: timeStr,
          status: "read",
          isVisible: true,
        },
      ]);

      await sleep(200);
    }

    if (activeStepRef.current === currentStep) {
      setIsFinished(true);
    }
  };

  const handleBackToTopics = () => {
    router.push("/chat-guidance");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-['iranSans-r']">
        <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div
        className="flex flex-col items-center justify-center h-[60vh] text-center p-6 font-['iranSans-r']"
        dir="rtl"
      >
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h3 className="font-['iranBold'] text-lg mb-2 text-[var(--color-text-primary)]">خطا در بارگذاری</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">{error || "تاپیک یافت نشد"}</p>
        <button
          onClick={handleBackToTopics}
          className="px-6 py-2.5 bg-[var(--color-secondary)] text-[var(--color-text-invert)] rounded-xl text-sm font-['iranBold'] hover:opacity-90 transition shadow-md"
        >
          بازگشت به تاپیک‌ها
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[85vh] w-full max-w-2xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl my-6 font-['iranSans-r']"
      dir="rtl"
    >
      {/* هدر چت */}
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]">
        <div>
          <h3 className="font-['iranBold'] text-base text-[var(--color-primary)]">{topic.title}</h3>
          {topic.description && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{topic.description}</p>
          )}
        </div>
        <button
          onClick={handleBackToTopics}
          className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-100 transition font-['iranBold']"
        >
          <LogOut className="w-3.5 h-3.5" />
          خروج
        </button>
      </div>

      {/* دکمه‌های موضوعات قابل انتخاب */}
      <div className="flex gap-2 overflow-x-auto p-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] scrollbar-hide">
        {topic.questions && topic.questions.length > 0 ? (
          topic.questions.map((q, idx) => {
            const isSelected = selectedQuestion?.id === q.id || selectedQuestion?.title === q.title;
            return (
              <button
                key={q.id || `q-${idx}`}
                onClick={() => handleSelectQuestion(q)}
                className={`px-4 py-2 rounded-2xl text-xs font-['iranBold'] whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-[var(--color-secondary)] text-[var(--color-text-invert)] shadow-lg shadow-blue-500/20 scale-105"
                    : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)]"
                }`}
              >
                {q.title}
              </button>
            );
          })
        ) : (
          <div className="text-xs text-[var(--color-text-secondary)] py-1 px-2">
            هیچ موضوعی برای این تاپیک ثبت نشده است
          </div>
        )}
      </div>

      {/* بدنه پیام‌ها */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-bg)]"
      >
        {!selectedQuestion && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl flex items-center justify-center mb-3 text-[var(--color-secondary)] font-['iranBold'] text-2xl shadow-sm">
              💬
            </div>
            <p className="text-sm text-[var(--color-text-primary)] font-['iranBold']">
              یک موضوع را از بالا انتخاب کنید
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              مشاهده پیام‌های مشاوره به صورت زنده
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* نوار وضعیت پایین */}
      <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] min-h-[55px] flex items-center justify-between px-4">
        {isFinished ? (
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-['iranBold'] text-[var(--color-success)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[var(--color-success)] rounded-full animate-pulse"></span>
              پایان گفتگو ✅
            </span>
            <button
              onClick={() => handleSelectQuestion(selectedQuestion!)}
              className="text-xs text-[var(--color-secondary)] font-['iranBold'] hover:underline"
            >
              شروع مجدد
            </button>
          </div>
        ) : (
          <span className="text-xs text-[var(--color-text-secondary)] w-full text-center">
            {selectedQuestion
              ? "در حال انجام گفتگو..."
              : "منتظر انتخاب موضوع..."}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center font-['iranSans-r']">
          <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}