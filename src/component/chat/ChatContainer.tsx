// src/component/chat/ChatContainer.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatChoices from "./ChatChoices";
import ChatHeader from "./ChatHeader";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  sender: "student" | "advisor";
  type: "text" | "image" | "audio" | "video" | "file";
  text?: string;
  delay?: number;
  typing?: number;
  showTicks?: boolean;
}

interface Choice {
  id: string;
  text: string;
  next: string;
}

interface Conversation {
  _id?: string;
  slug: string;
  title: string;
  topicSlug: string;
  messages: Message[];
  choices: Choice[];
  isStart: boolean;
  isEnd: boolean;
}

interface Topic {
  _id: string;
  slug: string;
  title: string;
  image: string;
  description: string;
}

export default function ChatContainer() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // ✅ 1. فقط در Client-side mount شود
  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Clear all timers on unmount
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  // ✅ 2. Fetch topics با error handling بهتر
  useEffect(() => {
    if (!isMounted) return;

    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        const response = await fetch("/api/chat/topics");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setTopics(result.data);
        } else {
          console.error("Invalid topics data:", result);
          setTopics([]);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
        setError("خطا در دریافت موضوعات");
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [isMounted]);

  // ✅ 3. دریافت شروع گفتگو با error handling بهتر
  const fetchStartConversation = useCallback(async (topicSlug: string) => {
    if (!isMounted) return;

    setLoading(true);
    setShowChoices(false);
    setDisplayedMessages([]);
    setError(null);
    
    try {
      const response = await fetch(`/api/chat/start?topic=${topicSlug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setCurrentConversation(result.data);
        startDisplayingMessages(result.data.messages);
      } else {
        setError("گفتگویی برای این موضوع وجود ندارد");
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }, [isMounted]);

  // ✅ 4. دریافت ادامه گفتگو
  const fetchNextConversation = useCallback(async (slug: string) => {
    if (!isMounted) return;

    setLoading(true);
    setShowChoices(false);
    setDisplayedMessages([]);
    setError(null);
    
    try {
      const response = await fetch(`/api/chat/conversation?slug=${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setCurrentConversation(result.data);
        startDisplayingMessages(result.data.messages);
      } else {
        setError("این بخش در حال آماده‌سازی است");
        setTimeout(() => {
          if (isMounted) setShowChoices(true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching next conversation:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }, [isMounted]);

  // ✅ 5. نمایش پیام‌ها با تاخیر (با مدیریت Timer)
  const startDisplayingMessages = useCallback((newMessages: Message[]) => {
    if (!isMounted || !newMessages || newMessages.length === 0) return;

    let delay = 0;

    newMessages.forEach((message, index) => {
      delay += message.delay || 0;
      
      if (message.typing && message.typing > 0) {
        const typingTimer = setTimeout(() => {
          if (isMounted) setTyping(true);
        }, delay);
        timersRef.current.push(typingTimer);
        
        delay += message.typing;
        
        const stopTypingTimer = setTimeout(() => {
          if (isMounted) setTyping(false);
        }, delay);
        timersRef.current.push(stopTypingTimer);
      }

      const messageTimer = setTimeout(() => {
        if (isMounted) {
          setDisplayedMessages((prev) => [...prev, message]);
          
          if (index === newMessages.length - 1) {
            setTimeout(() => {
              if (isMounted) setShowChoices(true);
            }, 500);
          }
        }
      }, delay);
      timersRef.current.push(messageTimer);
    });
  }, [isMounted]);

  // ✅ 6. اسکرول به پایین (با بررسی وجود element)
  const scrollToBottom = useCallback(() => {
    if (!isMounted) return;
    
    // استفاده از requestAnimationFrame برای اطمینان از DOM update
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "end"
        });
      }
    });
  }, [isMounted]);

  // ✅ 7. اسکرول فقط زمانی که پیام جدید اضافه می‌شود
  useEffect(() => {
    if (isMounted && displayedMessages.length > 0) {
      scrollToBottom();
    }
  }, [displayedMessages, scrollToBottom, isMounted]);

  // ✅ 8. انتخاب موضوع
  const handleTopicSelect = useCallback((topicSlug: string) => {
    setSelectedTopic(topicSlug);
    fetchStartConversation(topicSlug);
  }, [fetchStartConversation]);

  // ✅ 9. انتخاب گزینه
  const handleChoiceSelect = useCallback((nextSlug: string) => {
    fetchNextConversation(nextSlug);
  }, [fetchNextConversation]);

  // ✅ 10. بازگشت
  const handleBack = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
    
    setCurrentConversation(null);
    setSelectedTopic(null);
    setDisplayedMessages([]);
    setShowChoices(false);
    setTyping(false);
    setError(null);
  }, []);

  // ✅ 11. کامپوننت TopicSelector با حالت نمایش
  const TopicSelector = useCallback(() => {
    if (!isMounted) return null;

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          🎯 انتخاب موضوع گفتگو
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          برای شروع مشاوره، یکی از موضوعات زیر را انتخاب کنید
        </p>
        
        {loadingTopics ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600">هیچ موضوعی یافت نشد</p>
            <p className="text-sm text-gray-400 mt-2">لطفاً دوباره تلاش کنید</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
            {topics.map((topic) => (
              <button
                key={topic._id}
                onClick={() => handleTopicSelect(topic.slug)}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-accent group text-right"
              >
                <div className="text-5xl mb-4">{topic.image || "📚"}</div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-accent transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {topic.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }, [isMounted, loadingTopics, topics, handleTopicSelect]);

  // ✅ 12. اگر در Server-side یا قبل از mount، یک placeholder نمایش بده
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {currentConversation && (
        <ChatHeader
          title={currentConversation.title}
          onBack={handleBack}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedTopic ? (
          <TopicSelector />
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
              <div className="text-6xl mb-4">😕</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
              >
                بازگشت به موضوعات
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {displayedMessages.map((message, index) => (
              <ChatMessage
                key={message.id || index}
                message={message}
                isStudent={message.sender === "student"}
              />
            ))}
            {typing && <TypingIndicator />}
            {showChoices && currentConversation?.choices && currentConversation.choices.length > 0 && (
              <ChatChoices
                choices={currentConversation.choices}
                onSelect={handleChoiceSelect}
              />
            )}
            {showChoices && currentConversation?.isEnd && (
              <div className="text-center mt-6 p-4 bg-gray-100 rounded-xl">
                <p className="text-gray-600">✨ پایان گفتگو</p>
                <button
                  onClick={handleBack}
                  className="mt-2 text-accent hover:underline"
                >
                  بازگشت به موضوعات
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}