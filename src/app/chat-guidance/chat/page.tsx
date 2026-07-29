"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, LogOut, RefreshCw, HelpCircle } from "lucide-react";
import ChatMessage from "./../../../component/chat/ChatMessage";
import TypingIndicator from "./../../../component/chat/TypingIndicator";

export interface IOption {
  id: string;
  label: string;
  nextResponseText: string;
}

export interface IMessage {
  id?: string;
  sender: "advisor" | "student";
  text: string;
  options?: IOption[];
}

export interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

export interface ITopic {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  questions: IQuestion[];
}

export interface ChatMessageType {
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

  // لیست گزینه‌های فعال موجود در پایین صفحه چت
  const [activeOptions, setActiveOptions] = useState<IOption[]>([]);

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
  }, [chatMessages, isTyping, activeOptions]);

  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelectQuestion = async (q: IQuestion) => {
    const currentStep = ++activeStepRef.current;
    setSelectedQuestion(q);
    setChatMessages([]);
    setIsFinished(false);
    setActiveOptions([]);

    const msgs = q.messages || [];

    for (let i = 0; i < msgs.length; i++) {
      if (activeStepRef.current !== currentStep) return;

      const msg = msgs[i];

      if (msg.sender === "advisor") {
        await sleep(500);
        if (activeStepRef.current !== currentStep) return;

        setIsTyping(true);
        await sleep(1500);
        if (activeStepRef.current !== currentStep) return;
        setIsTyping(false);
      } else {
        await sleep(600);
        if (activeStepRef.current !== currentStep) return;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `${q.id || i}-${i}-${Date.now()}`,
          sender: msg.sender,
          text: msg.text,
          time: getTimeString(),
          status: "read",
          isVisible: true,
        },
      ]);

      // اگر پیام دارای گزینه‌های انتخابی بود، آن‌ها را فعال کرده و منتظر کلیک کاربر می‌مانیم
      if (msg.options && msg.options.length > 0) {
        setActiveOptions(msg.options);
        return;
      }

      await sleep(1000);
    }

    if (activeStepRef.current === currentStep) {
      setIsFinished(true);
    }
  };

  // هندلر انتخاب یکی از سوالات توسط کاربر در پایین صفحه
  const handleSelectOption = async (selectedOpt: IOption) => {
    const currentStep = activeStepRef.current;

    // ۱. اضافه شدن متن سوال به چت از سمت کاربر
    setChatMessages((prev) => [
      ...prev,
      {
        id: `user_opt_${Date.now()}`,
        sender: "student",
        text: selectedOpt.label,
        time: getTimeString(),
        status: "read",
        isVisible: true,
      },
    ]);

    // ۲. حذف سوال انتخاب‌شده از لیست دکمه‌های پایین
    const remainingOptions = activeOptions.filter((opt) => opt.id !== selectedOpt.id);
    setActiveOptions(remainingOptions);

    // ۳. تایپینگ مشاور
    await sleep(500);
    if (activeStepRef.current !== currentStep) return;

    setIsTyping(true);
    await sleep(1800);
    if (activeStepRef.current !== currentStep) return;
    setIsTyping(false);

    // ۴. اضافه شدن پاسخ مشاور به چت
    setChatMessages((prev) => [
      ...prev,
      {
        id: `advisor_ans_${Date.now()}`,
        sender: "advisor",
        text: selectedOpt.nextResponseText,
        time: getTimeString(),
        status: "read",
        isVisible: true,
      },
    ]);

    // ۵. اگر سوال دیگری باقی نمانده بود چت به پایان می‌رسد
    if (remainingOptions.length === 0) {
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
      className="flex flex-col h-[90vh] max-h-[850px] min-h-[600px] w-full max-w-3xl mx-auto mt-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl my-4 font-['iranSans-r']"
      dir="rtl"
    >
      {/* هدر چت */}
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)] shrink-0">
        <div>
          <h3 className="font-['iranBold'] text-base text-[var(--color-primary)]">{topic.title}</h3>
          {topic.description && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{topic.description}</p>
          )}
        </div>
        <button
          onClick={handleBackToTopics}
          className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-100 transition font-['iranBold']"
        >
          <LogOut className="w-3.5 h-3.5" />
          خروج
        </button>
      </div>

      {/* دکمه‌های موضوعات */}
      <div className="flex gap-2 overflow-x-auto p-3.5 border-b border-[var(--color-border)] bg-[var(--color-bg)] scrollbar-hide shrink-0">
        {topic.questions && topic.questions.length > 0 ? (
          topic.questions.map((q, idx) => {
            const isSelected = selectedQuestion?.id === q.id || selectedQuestion?.title === q.title;
            return (
              <button
                key={q.id || `q-${idx}`}
                onClick={() => handleSelectQuestion(q)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-['iranBold'] whitespace-nowrap transition-all duration-200 ${
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

      {/* بدنه چت (پیام‌ها) */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[var(--color-bg)] min-h-[350px]"
      >
        {!selectedQuestion && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl flex items-center justify-center mb-3 text-[var(--color-secondary)] font-['iranBold'] text-2xl shadow-sm">
              💬
            </div>
            <p className="text-sm text-[var(--color-text-primary)] font-['iranBold']">
              یک موضوع را از بالا انتخاب کنید
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* بخش گزینه‌ها و سوالات باقیمانده در پایین صفحه */}
      {/* بخش گزینه‌ها و سوالات باقیمانده در پایین صفحه */}
{activeOptions.length > 0 && !isTyping && (
  <div className="p-4 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] border-t-2 border-[var(--color-secondary)]/20 space-y-3 animate-in slide-in-from-bottom duration-300 shadow-inner">
    <div className="flex items-center justify-between">
      <p className="text-xs font-['iranBold'] text-[var(--color-primary)] flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-secondary)]"></span>
        </span>
        یک سوال را برای ادامه گفتگو انتخاب کنید:
      </p>
      <span className="text-[11px] font-['iranBold'] px-2.5 py-0.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20">
        {activeOptions.length} سوال باقیمانده
      </span>
    </div>

    <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
      {activeOptions.map((opt, index) => (
        <button
          key={opt.id}
          onClick={() => handleSelectOption(opt)}
          className="w-full text-right bg-white dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-[var(--color-secondary)] p-3.5 rounded-2xl text-xs sm:text-sm font-['iranBold'] transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-start gap-2.5 max-w-[85%]">
            <span className="text-base leading-none select-none">💬</span>
            <span className="leading-relaxed">{opt.label}</span>
          </div>
          <span className="shrink-0 text-[11px] font-['iranBold'] text-[var(--color-secondary)] bg-blue-50 dark:bg-slate-800 group-hover:bg-[var(--color-secondary)] group-hover:text-white px-3 py-1.5 rounded-xl border border-blue-100 dark:border-slate-600 transition-all">
            پاسخ ←
          </span>
        </button>
      ))}
    </div>
  </div>
)}

      {/* نوار وضعیت پایانی */}
      <div className="p-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] min-h-[50px] flex items-center justify-between px-5 shrink-0">
        {isFinished ? (
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-['iranBold'] text-[var(--color-success)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[var(--color-success)] rounded-full animate-pulse"></span>
              تمام سوالات پاسخ داده شدند ✅
            </span>
            <button
              onClick={() => handleSelectQuestion(selectedQuestion!)}
              className="text-xs text-[var(--color-secondary)] font-['iranBold'] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              شروع مجدد
            </button>
          </div>
        ) : isTyping ? (
          <span className="text-xs text-[var(--color-text-secondary)] w-full text-center">
            مشاور در حال پاسخگویی...
          </span>
        ) : activeOptions.length > 0 ? (
          <span className="text-xs text-[var(--color-secondary)] font-['iranBold'] w-full text-center animate-pulse">
            👆 لطفاً یکی از سوالات بالا را انتخاب کنید
          </span>
        ) : (
          <span className="text-xs text-[var(--color-text-secondary)] w-full text-center">
            {selectedQuestion ? "پایان پیام‌ها" : "منتظر انتخاب موضوع..."}
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