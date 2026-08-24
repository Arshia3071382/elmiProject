"use client";

import { useState, useEffect, useCallback } from "react";
import ExistingTopicsList from "./topics/ExistingTopicsList";
import TopicForm from "./topics/TopicForm";
import { IExistingTopic, IQuestion, IOption } from "./topics/constants";

interface AdminTopicsPanelProps {
  onShowMessage: (type: "success" | "error", text: string) => void;
}

export default function AdminTopicsPanel({ onShowMessage }: AdminTopicsPanelProps) {
  // Existing topics
  const [existingTopics, setExistingTopics] = useState<IExistingTopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  // Topic fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  // Questions
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

  // Message form
  const [messageText, setMessageText] = useState("");
  const [sender, setSender] = useState<"student" | "advisor">("advisor");
  const [isInteractive, setIsInteractive] = useState(false);
  const [optionLabel, setOptionLabel] = useState("");
  const [optionResponse, setOptionResponse] = useState("");
  const [options, setOptions] = useState<IOption[]>([]);

  // Fetch existing topics
  const fetchExistingTopics = useCallback(async () => {
    setIsLoadingTopics(true);
    try {
      const res = await fetch("/api/chat/topics");
      const resData = await res.json();
      if (res.ok && resData.success && Array.isArray(resData.data)) {
        setExistingTopics(resData.data);
      } else {
        setExistingTopics([]);
      }
    } catch {
      onShowMessage("error", "خطا در دریافت لیست تاپیک‌های قبلی");
    } finally {
      setIsLoadingTopics(false);
    }
  }, [onShowMessage]);

  // Delete topic
  const handleDeleteTopic = async (topicId: string, topicTitle: string) => {
    if (!confirm(`آیا از حذف کامل تاپیک «${topicTitle}» اطمینان دارید؟`)) return;

    try {
      const res = await fetch(`/api/chat/topics/${topicId}`, { method: "DELETE" });
      const resData = await res.json();

      if (res.ok && resData.success) {
        onShowMessage("success", "تاپیک با موفقیت حذف شد.");
        fetchExistingTopics();
      } else {
        onShowMessage("error", resData.error || "خطا در حذف تاپیک");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور هنگام حذف تاپیک");
    }
  };

  // Question handlers
  const handleAddQuestion = () => {
    if (!currentQuestionTitle.trim()) {
      return onShowMessage("error", "عنوان موضوع گفتگو را وارد کنید.");
    }
    const newQ: IQuestion = {
      id: `q_${Date.now()}`,
      title: currentQuestionTitle.trim(),
      messages: [],
    };
    setQuestions((prev) => {
      const updated = [...prev, newQ];
      if (activeQuestionIndex === null) {
        setActiveQuestionIndex(updated.length - 1);
      }
      return updated;
    });
    setCurrentQuestionTitle("");
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(null);
    } else if (activeQuestionIndex !== null && activeQuestionIndex > index) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  // Message handlers
  const handleAddMessage = () => {
    if (activeQuestionIndex === null || !questions[activeQuestionIndex]) {
      return onShowMessage("error", "ابتدا یک موضوع گفتگو را انتخاب کنید.");
    }
    if (!messageText.trim()) {
      return onShowMessage("error", "متن پیام نمی‌تواند خالی باشد.");
    }
    if (isInteractive && options.length === 0) {
      return onShowMessage("error", "حداقل باید یک گزینه/دکمه اضافه کنید.");
    }

    const newMsg = {
      id: `m_${Date.now()}`,
      sender,
      text: messageText.trim(),
      options: isInteractive && options.length > 0 ? options : undefined,
    };

    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === activeQuestionIndex
          ? { ...q, messages: [...q.messages, newMsg] }
          : q
      )
    );

    setMessageText("");
    setOptions([]);
    setIsInteractive(false);
  };

  const handleRemoveMessage = (qIndex: number, mIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qIndex
          ? { ...q, messages: q.messages.filter((_, i) => i !== mIndex) }
          : q
      )
    );
  };

  // Option handlers
  const handleAddOption = () => {
    if (!optionLabel.trim() || !optionResponse.trim()) {
      return onShowMessage("error", "متن گزینه و پاسخ آن را وارد کنید.");
    }
    const newOpt: IOption = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      label: optionLabel.trim(),
      nextResponseText: optionResponse.trim(),
    };
    setOptions((prev) => [...prev, newOpt]);
    setOptionLabel("");
    setOptionResponse("");
  };

  const handleRemoveOption = (optId: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== optId));
  };

  // Submit topic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      return onShowMessage("error", "عنوان و اسلاگ تاپیک الزامی است.");
    }
    if (questions.length === 0) {
      return onShowMessage("error", "حداقل باید یک موضوع گفتگو اضافه کنید.");
    }

    try {
      const res = await fetch("/api/chat/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          questions,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        onShowMessage("success", "تاپیک گفتینو با موفقیت در دیتابیس ذخیره شد.");
        setTitle("");
        setSlug("");
        setDescription("");
        setQuestions([]);
        setActiveQuestionIndex(null);
        fetchExistingTopics();
      } else {
        onShowMessage("error", data.error || "خطا در ثبت تاپیک");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchExistingTopics();
  }, [fetchExistingTopics]);

  return (
    <div className="space-y-8 font-sans">
      <ExistingTopicsList
        topics={existingTopics}
        isLoading={isLoadingTopics}
        onRefresh={fetchExistingTopics}
        onDelete={handleDeleteTopic}
      />

      <TopicForm
        title={title}
        slug={slug}
        description={description}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
        onDescriptionChange={setDescription}
        questions={questions}
        activeQuestionIndex={activeQuestionIndex}
        currentQuestionTitle={currentQuestionTitle}
        onCurrentQuestionChange={setCurrentQuestionTitle}
        onAddQuestion={handleAddQuestion}
        onRemoveQuestion={handleRemoveQuestion}
        onSelectQuestion={setActiveQuestionIndex}
        onRemoveMessage={handleRemoveMessage}
        sender={sender}
        messageText={messageText}
        isInteractive={isInteractive}
        options={options}
        optionLabel={optionLabel}
        optionResponse={optionResponse}
        onSenderChange={setSender}
        onMessageTextChange={setMessageText}
        onToggleInteractive={setIsInteractive}
        onOptionLabelChange={setOptionLabel}
        onOptionResponseChange={setOptionResponse}
        onAddOption={handleAddOption}
        onRemoveOption={handleRemoveOption}
        onAddMessage={handleAddMessage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}