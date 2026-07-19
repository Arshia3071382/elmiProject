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
  const [loadingNode, setLoadingNode] = useState(true);
  const [isNotReady, setIsNotReady] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string>("");
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
          // اگر تاپیک انتخاب شده، title رو پیدا کن
          if (topicSlug) {
            const topic = res.data.find((t: any) => t.slug === topicSlug);
            if (topic) {
              setPageTitle(topic.title);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoadingTopics(false));
  }, [isMounted, topicSlug]);

  // ============================================
  // 3. اسکرول به پایین با انیمیشن
  // ============================================
  const scrollToBottom = () => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  // ============================================
  // 4. اسکرول بعد از هر پیام جدید
  // ============================================
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // ============================================
  // 5. اسکرول هنگام تایپینگ
  // ============================================
  useEffect(() => {
    if (isTyping) {
      setTimeout(scrollToBottom, 50);
    }
  }, [isTyping]);

  // ============================================
  // 6. لود کردن گام‌های چت با نمایش دونه‌دونه
  // ============================================
  const loadConversationNode = async (slug: string) => {
    if (!topicSlug) return;
    
    try {
      setLoadingNode(true);
      setChoices([]);
      setCurrentSlug(slug);
      
      console.log(`🔄 بارگذاری گام: ${slug} برای تاپیک: ${topicSlug}`);
      
      const response = await fetch(`/api/chat/conversation?topic=${topicSlug}&slug=${slug}`);
      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.log(`❌ گام ${slug} پیدا نشد`);
        setIsNotReady(true);
        setLoadingNode(false);
        return;
      }

      setIsNotReady(false);
      const node = result.data;
      const rawMessages = node.messages || [];

      // ============================================
      // نمایش پیام‌ها دونه‌دونه با تاخیر
      // ============================================
      for (let i = 0; i < rawMessages.length; i++) {
        const msg = rawMessages[i];
        
        // تایپینگ برای مشاور
        if (msg.sender === "advisor" && msg.typing) {
          setIsTyping(true);
          await new Promise(resolve => setTimeout(resolve, msg.typing));
          setIsTyping(false);
        } else if (msg.sender === "student") {
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        const newMessage: Message = { 
          ...msg, 
          id: msg.id || `msg-${Date.now()}-${i}`,
          time: timeStr, 
          status: "sending",
          isVisible: false
        };
        
        // اضافه کردن پیام
        setMessages(prev => [...prev, newMessage]);
        
        // اسکرول به پایین
        setTimeout(scrollToBottom, 50);

        // بعد از 100ms پیام رو visible کن (برای انیمیشن)
        setTimeout(() => {
          setMessages(prev => 
            prev.map(m => 
              m.id === newMessage.id ? { ...m, isVisible: true } : m
            )
          );
        }, 100);

        // آپدیت وضعیت پیام
        if (msg.sender === "advisor") {
          setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "sent" } : m));
          }, 250);
          setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m));
          }, 600);
        } else {
          setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m));
        }

        // مکث بین پیام‌ها
        if (i < rawMessages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // تنظیم گزینه‌ها بعد از تمام پیام‌ها
      setChoices(node.choices || []);
      setLoadingNode(false);
      
      // اسکرول نهایی
      setTimeout(scrollToBottom, 200);
      
      console.log(`✅ گام ${slug} بارگذاری شد با ${node.choices?.length || 0} انتخاب`);
      
    } catch (error) {
      console.error("❌ خطا در بارگذاری گام:", error);
      setIsNotReady(true);
      setLoadingNode(false);
    }
  };

  // ============================================
  // 7. بارگذاری گام شروع
  // ============================================
  useEffect(() => {
    if (topicSlug && isMounted) {
      setMessages([]);
      setLoadingNode(true);
      setIsNotReady(false);
      const startSlug = `${topicSlug}-start`;
      console.log(`🚀 شروع چت برای تاپیک: ${topicSlug} با گام: ${startSlug}`);
      loadConversationNode(startSlug);
    }
  }, [topicSlug, isMounted]);

  // ============================================
  // 8. انتخاب گزینه
  // ============================================
  const handleChoiceClick = (choice: Choice) => {
    if (!topicSlug) return;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    
    // اضافه کردن پیام دانشجو
    const studentMsg: Message = { 
      id: `choice-${Date.now()}`, 
      sender: "student", 
      text: choice.text, 
      time: timeStr, 
      status: "read",
      isVisible: true
    };
    
    setMessages(prev => [...prev, studentMsg]);
    setTimeout(scrollToBottom, 50);
    
    // بارگذاری گام بعدی با تاخیر
    setTimeout(() => {
      loadConversationNode(choice.next);
    }, 300);
  };

  // ============================================
  // 9. حالت لیست تاپیک‌ها
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
  // 10. حالت ارور
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
  // 11. حالت لودینگ
  // ============================================
  if (loadingNode) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-2xl bg-surface border border-border rounded-3xl p-8 shadow-xl" dir="rtl">
        <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">در حال بارگذاری اتاق مشاوره...</p>
        <p className="text-xs text-gray-400 mt-2">گام: {currentSlug || '...'}</p>
      </div>
    );
  }

  // ============================================
  // 12. حالت چت فعال
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

      {/* پیام‌ها */}
      <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg scroll-smooth">
        {messages.map((msg) => {
          const isAdvisor = msg.sender === "advisor";
          return (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 transition-all duration-500 transform ${
                isAdvisor ? "justify-start" : "justify-end"
              } ${
                msg.isVisible !== false 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-6 opacity-0"
              }`}
            >
              {isAdvisor && (
                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm shadow-sm shrink-0 select-none">
                  👨‍🏫
                </div>
              )}

              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative leading-relaxed pb-6 ${
                isAdvisor ? "bg-surface text-text-primary rounded-bl-none border border-border" : "bg-secondary text-white rounded-br-none"
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                
                <div className="absolute bottom-1 left-3 flex items-center gap-1 text-[9px] opacity-50 select-none">
                  <span>{msg.time}</span>
                  {isAdvisor && (
                    <span>
                      {msg.status === "sending" && <span className="animate-pulse">...</span>}
                      {msg.status === "sent" && <Check className="w-2.5 h-2.5" />}
                      {msg.status === "read" && <CheckCheck className="w-2.5 h-2.5 text-accent" />}
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

        {/* تایپینگ */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm shadow-sm shrink-0">
              👨‍🏫
            </div>
            <div className="bg-surface rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-border flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
      </div>

      {/* گزینه‌ها */}
      <div className="p-4 bg-surface border-t border-border min-h-[90px] flex items-center justify-center">
        {choices.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center w-full">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoiceClick(choice)}
                className="bg-blue-50/70 hover:bg-blue-100 text-secondary font-['iranBold'] border border-blue-100 px-4 py-2.5 rounded-xl text-xs transition duration-150 active:scale-95 shadow-sm"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          !isTyping && messages.length > 0 && (
            <p className="text-xs text-text-secondary">پایان گفتگو ✅</p>
          )
        )}
      </div>

    </div>
  );
}