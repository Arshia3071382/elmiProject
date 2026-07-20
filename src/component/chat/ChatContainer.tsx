"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, GraduationCap, Atom, Scale, Award, MessageSquare, AlertCircle } from "lucide-react";
import ChatMessage, { Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ChatChoices from "./ChatChoices";

interface Choice {
  text: string;
  next: string;
}

interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  file: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getTopicStyling = (slug: string) => {
  switch (slug) {
    case "humanities":
      return {
        icon: <Scale className="w-8 h-8" />,
        gradient: "from-amber-50 to-orange-50/40 border-amber-200/60 text-amber-700 hover:border-amber-500",
        iconBg: "bg-amber-500 text-white shadow-amber-200"
      };
    case "mathematics":
      return {
        icon: <Atom className="w-8 h-8" />,
        gradient: "from-blue-50 to-indigo-50/40 border-blue-200/60 text-blue-700 hover:border-blue-500",
        iconBg: "bg-blue-500 text-white shadow-blue-200"
      };
    case "experimental":
      return {
        icon: <Award className="w-8 h-8" />,
        gradient: "from-emerald-50 to-teal-50/40 border-emerald-200/60 text-emerald-700 hover:border-emerald-500",
        iconBg: "bg-emerald-500 text-white shadow-emerald-200"
      };
    default:
      return {
        icon: <GraduationCap className="w-8 h-8" />,
        gradient: "from-slate-50 to-gray-50/40 border-border text-text-primary hover:border-secondary",
        iconBg: "bg-primary text-white shadow-slate-200"
      };
  }
};

export default function ChatContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const topicSlug = searchParams.get("t");
  const [pageTitle, setPageTitle] = useState("اتاق مشاوره تخصصی");

  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isNotReady, setIsNotReady] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  const activeStepRef = useRef<number>(0);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadedRef = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/chat/topics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setTopics(res.data || []);
          if (topicSlug) {
            const topic = res.data.find((t: any) => t.slug === topicSlug);
            if (topic) setPageTitle(topic.title);
          }
        }
      })
      .catch((err) => console.error(" Error fetching topics:", err))
      .finally(() => setLoadingTopics(false));
  }, [topicSlug]);

  const scrollToBottom = () => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      const timer = setTimeout(scrollToBottom, 40);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isTyping]);

  const loadConversationNode = useCallback(async (slug: string, isFirstLoad = false) => {
    if (!topicSlug) return;

    const currentStepId = ++activeStepRef.current;

    try {
      if (isFirstLoad) setLoadingInitial(true);
      setChoices([]);
      setIsTyping(false);

      const apiUrl = `/api/chat/conversation?topic=${topicSlug}&slug=${slug}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (activeStepRef.current !== currentStepId) return;
      if (isFirstLoad) setLoadingInitial(false);

      if (!result.success || !result.data) {
        setIsNotReady(true);
        setIsTyping(false);
        return;
      }

      setIsNotReady(false);
      const node = result.data;
      const rawMessages = node.messages || [];

      for (let i = 0; i < rawMessages.length; i++) {
        if (activeStepRef.current !== currentStepId) return;

        const msg = rawMessages[i];

        if (msg.sender === "advisor") {
          setIsTyping(true);
          const typingDuration = msg.typing || 1000;
          await sleep(typingDuration);
          if (activeStepRef.current !== currentStepId) return;
          setIsTyping(false);
        } else if (i > 0) {
          await sleep(500);
          if (activeStepRef.current !== currentStepId) return;
        }

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        const newMessage: Message = {
          ...msg,
          id: `${slug}-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          time: timeStr,
          status: "read",
          isVisible: true
        };

        setMessages((prev) => [...prev, newMessage]);
        await sleep(350);
      }

      if (activeStepRef.current === currentStepId) {
        setChoices(node.choices || []);
        setIsTyping(false);
      }
    } catch (error) {
      console.error(`Exception in loadConversationNode:`, error);
      if (activeStepRef.current === currentStepId) {
        setIsNotReady(true);
        setIsTyping(false);
        if (isFirstLoad) setLoadingInitial(false);
      }
    }
  }, [topicSlug]);

  useEffect(() => {
    if (topicSlug && initialLoadedRef.current !== topicSlug) {
      initialLoadedRef.current = topicSlug;
      setMessages([]);
      const startSlug = `${topicSlug}-start`;
      loadConversationNode(startSlug, true);
    }
  }, [topicSlug, loadConversationNode]);

  const handleChoiceClick = (nextSlug: string) => {
    if (!topicSlug) return;

    const selectedChoice = choices.find((c) => c.next === nextSlug);
    if (!selectedChoice) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const studentMsg: Message = {
      id: `choice-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: "student",
      text: selectedChoice.text,
      time: timeStr,
      status: "read",
      isVisible: true
    };

    setMessages((prev) => [...prev, studentMsg]);
    loadConversationNode(nextSlug, false);
  };

  if (!topicSlug) {
    if (loadingTopics) {
      return (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      );
    }

    return (
      <div dir="rtl" className="w-full max-w-5xl bg-surface border border-border rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-slate-100/70 font-['iranSans-r']">
        <div className="text-center space-y-3 mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-slate-200">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-['iranBold'] text-text-primary pt-2">
            مرکز مشاوره هوشمند گفتینو
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            دپارتمان تخصصی خود را برای شروع گفتگوی هدایت‌شده انتخاب کنید
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((t, idx) => {
            const style = getTopicStyling(t.slug);
            return (
              <button
                key={t.id || `${t.slug}-${idx}`}
                onClick={() => router.push(`/chat-guidance?t=${t.slug}`)}
                className={`group flex flex-col justify-between p-6 bg-gradient-to-br border rounded-2xl aspect-square transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg text-right cursor-pointer relative overflow-hidden ${style.gradient}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}>
                  {style.icon}
                </div>

                <div className="space-y-2 mt-auto z-10">
                  <h3 className="text-lg sm:text-xl font-['iranBold'] text-text-primary group-hover:text-secondary transition-colors duration-200">
                    {t.title}
                  </h3>
                  <p className="text-xs text-text-secondary">{t.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (isNotReady) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-xl text-center font-['iranSans-r']" dir="rtl">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-['iranBold'] text-text-primary mb-2">اتاق مشاوره آماده نیست</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          محتوای سناریو برای دپارتمان <span className="font-['iranBold'] text-secondary">{pageTitle}</span> در دسترس نیست.
        </p>
        <button
          onClick={() => router.push("/chat-guidance")}
          className="w-full py-3 bg-primary hover:bg-opacity-90 text-white font-['iranBold'] rounded-xl text-sm transition shadow-md"
        >
          بازگشت به لیست دپارتمان‌ها
        </button>
      </div>
    );
  }

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-2xl bg-surface border border-border rounded-3xl p-8 shadow-xl" dir="rtl">
        <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">در حال آماده‌سازی اتاق مشاوره...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-2xl bg-surface border border-border rounded-3xl overflow-hidden shadow-xl font-['iranSans-r']" dir="rtl">
      {/* هدر چت */}
      <div className="bg-surface p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm relative text-lg select-none">
            👨‍🏫
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-surface rounded-full"></span>
          </div>
          <div>
            <h3 className="font-['iranBold'] text-text-primary text-sm">{pageTitle}</h3>
            <p className="text-[11px] text-success font-semibold">مشاور دپارتمان آنلاین</p>
          </div>
        </div>
        <button 
          onClick={() => router.push("/chat-guidance")}
          className="text-xs text-text-secondary hover:text-secondary font-['iranBold'] bg-bg px-3 py-1.5 rounded-xl border border-border transition"
        >
          خروج
        </button>
      </div>

      {/* لیست پیام‌ها */}
      <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg scroll-smooth">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* بخش گزینه‌ها */}
      <div className="p-4 bg-surface border-t border-border min-h-[85px] flex items-center justify-center">
        {choices.length > 0 ? (
          <ChatChoices choices={choices} onSelect={handleChoiceClick} />
        ) : (
          !isTyping && messages.length > 0 && (
            <p className="text-xs text-text-secondary animate-pulse">پایان گفتگو ✅</p>
          )
        )}
      </div>
    </div>
  );
}