"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, CheckCheck, Loader2, GraduationCap, Atom, Scale, Award, ChevronLeft, MessageSquare, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "student" | "advisor";
  text: string;
  typing?: number;
  time?: string;
  status?: "sending" | "sent" | "read";
  isVisible?: boolean;
}

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
  const [loadingInitial, setLoadingInitial] = useState(true); // فقط برای لود اول بار صفحه چت
  const [isNotReady, setIsNotReady] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // ============================================
  // 1. Mount
  // ============================================
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // ============================================
  // 2. فچ کردن لیست موضوعات
  // ============================================
  useEffect(() => {
    if (!isMounted) return;
    
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
      .catch(console.error)
      .finally(() => setLoadingTopics(false));
  }, [isMounted, topicSlug]);

  // ============================================
  // 3. اسکرول فوری و روان به پایین
  // ============================================
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
      // استفاده از requestAnimationFrame یا تایمر بسیار کم برای تضمین رندر شدن DOM
      const timer = setTimeout(scrollToBottom, 30);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isTyping]);

  // ============================================
  // 4. لود کردن گام‌های چت با نمایش دونه‌دونه (تلگرامی)
  // ============================================
  const loadConversationNode = async (slug: string, isFirstLoad = false) => {
    if (!topicSlug) return;
    
    try {
      if (isFirstLoad) setLoadingInitial(true);
      setChoices([]);
      setIsTyping(true); // بلافاصله انیمیشن تایپینگ مشاور فعال شود
      
      const response = await fetch(`/api/chat/conversation?topic=${topicSlug}&slug=${slug}`);
      const result = await response.json();
      
      if (isFirstLoad) setLoadingInitial(false);

      if (!result.success || !result.data) {
        setIsNotReady(true);
        setIsTyping(false);
        return;
      }

      setIsNotReady(false);
      const node = result.data;
      const rawMessages = node.messages || [];

      // نمایش پیام‌ها دونه‌دونه با افکت زمان‌بندی شده
      for (let i = 0; i < rawMessages.length; i++) {
        const msg = rawMessages[i];
        
        if (msg.sender === "advisor") {
          setIsTyping(true);
          // زمان تایپ طبیعی یا حداقل 800 میلی‌ثانیه برای حس طبیعی بودن
          const typingDuration = msg.typing || 800;
          await new Promise(resolve => setTimeout(resolve, typingDuration));
          setIsTyping(false);
        }

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        const generatedId = msg.id || `msg-${Date.now()}-${i}`;

        const newMessage: Message = { 
          ...msg, 
          id: generatedId,
          time: timeStr, 
          status: "sending",
          isVisible: false
        };
        
        // اضافه کردن پیام به لیست
        setMessages(prev => [...prev, newMessage]);

        // فعال کردن کلاس انیمیشن بلافاصله در فریم بعدی
        setTimeout(() => {
          setMessages(prev => 
            prev.map(m => m.id === generatedId ? { ...m, isVisible: true, status: "sent" } : m)
          );
        }, 30);

        // شبیه‌سازی تیک دوم (خوانده شده) تلگرام بعد از مکث کوتاه
        if (msg.sender === "advisor") {
          setTimeout(() => {
            setMessages(prev => 
              prev.map(m => m.id === generatedId ? { ...m, status: "read" } : m)
            );
          }, 400);
        }

        // فاصله بین دو پیام متوالی مشاور
        if (i < rawMessages.length - 1) {
          setIsTyping(true);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }

      // نمایش گزینه‌های انتخاب پس از اتمام کامل پیام‌ها
      setChoices(node.choices || []);
      setIsTyping(false);
      
    } catch (error) {
      console.error(error);
      setIsNotReady(true);
      setIsTyping(false);
      if (isFirstLoad) setLoadingInitial(false);
    }
  };

  // ============================================
  // 5. بارگذاری گام شروع
  // ============================================
  useEffect(() => {
    if (topicSlug && isMounted) {
      setMessages([]);
      const startSlug = `${topicSlug}-start`;
      loadConversationNode(startSlug, true);
    }
  }, [topicSlug, isMounted]);

  // ============================================
  // 6. انتخاب گزینه توسط کاربر
  // ============================================
  const handleChoiceClick = (choice: Choice) => {
    if (!topicSlug) return;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    
    const studentMsg: Message = { 
      id: `choice-${Date.now()}`, 
      sender: "student", 
      text: choice.text, 
      time: timeStr, 
      status: "read",
      isVisible: true
    };
    
    setMessages(prev => [...prev, studentMsg]);
    
    // انتقال سریع به گام بعدی بدون غیب کردن چت‌باکس
    loadConversationNode(choice.next, false);
  };

  // ============================================
  // 7. حالت لیست تاپیک‌ها
  // ============================================
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
          {topics.map((t) => {
            const style = getTopicStyling(t.slug);
            return (
              <button
                key={t.id}
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
                  <div className="flex items-center gap-1 text-xs font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>شروع مشاوره تخصصی</span>
                    <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-current opacity-[0.02] rounded-full group-hover:scale-150 transition-transform duration-500" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================
  // 8. حالت ارور
  // ============================================
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

  // ============================================
  // 9. حالت لودینگ اولیه اتاق
  // ============================================
  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-2xl bg-surface border border-border rounded-3xl p-8 shadow-xl" dir="rtl">
        <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">در حال آماده‌سازی اتاق مشاوره...</p>
      </div>
    );
  }

  // ============================================
  // 10. ساختار چت فعال (بسیار سریع و انیمیشنی)
  // ============================================
  return (
    <div className="flex flex-col h-[85vh] w-full max-w-2xl bg-surface border border-border rounded-3xl overflow-hidden shadow-xl font-['iranSans-r']" dir="rtl">
      
      {/* هدر */}
      <div className="bg-surface p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm relative text-lg">
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

      {/* باکس پیام‌ها */}
      <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg scroll-smooth">
        {messages.map((msg) => {
          const isAdvisor = msg.sender === "advisor";
          return (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 transition-all duration-300 ease-out transform ${
                isAdvisor ? "justify-start" : "justify-end"
              } ${
                msg.isVisible !== false 
                  ? "translate-y-0 opacity-100 scale-100" 
                  : "translate-y-4 opacity-0 scale-95"
              }`}
            >
              {isAdvisor && (
                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
                  👨‍🏫
                </div>
              )}

              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative leading-relaxed pb-6 transition-all ${
                isAdvisor 
                  ? "bg-surface text-text-primary rounded-bl-none border border-border" 
                  : "bg-secondary text-white rounded-br-none"
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                
                <div className="absolute bottom-1 left-3 flex items-center gap-1 text-[9px] opacity-60 select-none">
                  <span>{msg.time}</span>
                  {!isAdvisor && (
                    <CheckCheck className="w-2.5 h-2.5 opacity-70" />
                  )}
                  {isAdvisor && (
                    <span>
                      {msg.status === "sending" && <span className="animate-pulse">...</span>}
                      {msg.status === "sent" && <Check className="w-2.5 h-2.5 text-gray-400" />}
                      {msg.status === "read" && <CheckCheck className="w-2.5 h-2.5 text-blue-500" />}
                    </span>
                  )}
                </div>
              </div>

              {!isAdvisor && (
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
                  👨‍🎓
                </div>
              )}
            </div>
          );
        })}

        {/* لودینگ تایپینگ زیبا به سبک تلگرام */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start transition-opacity duration-200">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm shadow-sm shrink-0">
              👨‍🏫
            </div>
            <div className="bg-surface rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-border flex items-center gap-1.5 real-typing-effect">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
      </div>

      {/* دکمه‌های گزینه‌ها */}
      <div className="p-4 bg-surface border-t border-border min-h-[85px] flex items-center justify-center transition-all duration-300">
        {choices.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoiceClick(choice)}
                className="bg-blue-50/70 hover:bg-blue-100 text-secondary font-['iranBold'] border border-blue-100 px-4 py-2.5 rounded-xl text-xs transition-all duration-150 active:scale-95 shadow-sm"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          !isTyping && messages.length > 0 && (
            <p className="text-xs text-text-secondary animate-pulse">پایان گفتگو ✅</p>
          )
        )}
      </div>

    </div>
  );
}