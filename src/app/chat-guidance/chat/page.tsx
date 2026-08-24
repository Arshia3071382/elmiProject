// Chat page - Main component
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import ChatHeader from "./ChatHeader";
import QuestionButtons from "./QuestionButtons";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import OptionModal from "./OptionModal";
import { ITopic, IQuestion, IOption, ChatMessageType, sleep, getTimeString } from "./constants";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicSlug = searchParams.get("t");

  // State
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOptions, setActiveOptions] = useState<IOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeStepRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch topic
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

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isTyping, activeOptions, isModalOpen]);

  // Select question handler
  const handleSelectQuestion = async (q: IQuestion) => {
    const currentStep = ++activeStepRef.current;
    setSelectedQuestion(q);
    setChatMessages([]);
    setIsFinished(false);
    setActiveOptions([]);
    setIsModalOpen(false);

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

      if (msg.options && msg.options.length > 0) {
        setActiveOptions(msg.options);
        setIsModalOpen(true);
        return;
      }

      await sleep(1000);
    }

    if (activeStepRef.current === currentStep) {
      setIsFinished(true);
    }
  };

  // Select option handler
  const handleSelectOption = async (selectedOpt: IOption) => {
    const currentStep = activeStepRef.current;
    setIsModalOpen(false);

    // Add user message
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

    // Remove selected option
    const remainingOptions = activeOptions.filter((opt) => opt.id !== selectedOpt.id);
    setActiveOptions(remainingOptions);

    // Typing
    await sleep(500);
    if (activeStepRef.current !== currentStep) return;
    setIsTyping(true);
    await sleep(1800);
    if (activeStepRef.current !== currentStep) return;
    setIsTyping(false);

    // Add advisor response
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

    if (remainingOptions.length === 0) {
      setIsFinished(true);
    }
  };

  // Navigate back
  const handleBack = () => {
    router.push("/chat-guidance");
  };

  // Restart
  const handleRestart = () => {
    if (selectedQuestion) {
      handleSelectQuestion(selectedQuestion);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !topic) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  return (
    <div
      className="relative flex flex-col h-[90vh] max-h-[850px] min-h-[600px] w-full max-w-3xl mx-auto mt-10 sm:mt-30 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl my-4 font-['iranSans-r']"
      dir="rtl"
    >
      <ChatHeader topic={topic} onBack={handleBack} />

      <QuestionButtons
        questions={topic.questions || []}
        selectedQuestion={selectedQuestion}
        onSelect={handleSelectQuestion}
      />

      <ChatMessages
        ref={scrollRef}
        messages={chatMessages}
        isTyping={isTyping}
        hasSelectedQuestion={!!selectedQuestion}
      />

      <ChatFooter
        isFinished={isFinished}
        isTyping={isTyping}
        activeOptions={activeOptions}
        isModalOpen={isModalOpen}
        selectedQuestion={selectedQuestion}
        onRestart={handleRestart}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {isModalOpen && activeOptions.length > 0 && (
        <OptionModal options={activeOptions} onSelect={handleSelectOption} />
      )}
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