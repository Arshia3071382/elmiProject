"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Send, Save, MessageSquare, GitBranch, CornerDownLeft, RefreshCw } from "lucide-react";

export interface IOption {
  id: string;
  label: string;
  nextResponseText: string;
}

export interface IMessage {
  id: string;
  sender: "advisor" | "student";
  text: string;
  options?: IOption[];
}

export interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

export interface IExistingTopic {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  questions: IQuestion[];
}

export default function AdminTopicsPanel({
  onShowMessage,
}: {
  onShowMessage: (type: "success" | "error", text: string) => void;
}) {
  // تاپیک‌های قبلی دریافت شده از دیتابیس
  const [existingTopics, setExistingTopics] = useState<IExistingTopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  // استیت‌های ساخت تاپیک جدید
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState("");

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

  // فیلدهای پیام معمولی
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageSender, setNewMessageSender] = useState<"student" | "advisor">("advisor");

  // گزینه‌های تعاملی
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [optionLabel, setOptionLabel] = useState("");
  const [optionResponse, setOptionResponse] = useState("");
  const [tempOptions, setTempOptions] = useState<IOption[]>([]);

  // دریافت تاپیک‌های ذخیره شده از سرور
  // ۱. دریافت لیست تاپیک‌های قبلی
const fetchExistingTopics = useCallback(async () => {
  setIsLoadingTopics(true);
  try {
    const res = await fetch("/api/chat/topics");
    const resData = await res.json();

    // اصلاح شده: خواندن دیتا از resData.data به جای resData.topics
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

// ۲. حذف تاپیک با استفاده از Dynamic Route استاندارد
const handleDeleteExistingTopic = async (topicId: string, topicTitle: string) => {
  if (!confirm(`آیا از حذف کامل تاپیک «${topicTitle}» اطمینان دارید؟`)) return;

  try {
    const res = await fetch(`/api/chat/topics/${topicId}`, {
      method: "DELETE",
    });
    const resData = await res.json();

    if (res.ok && resData.success) {
      onShowMessage("success", "تاپیک با موفقیت حذف شد.");
      fetchExistingTopics(); // بروزرسانی مجدد لیست
    } else {
      onShowMessage("error", resData.error || "خطا در حذف تاپیک");
    }
  } catch {
    onShowMessage("error", "خطا در ارتباط با سرور هنگام حذف تاپیک");
  }
};

  // افزودن موضوع جدید
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

  // حذف موضوع
  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));

    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(null);
    } else if (activeQuestionIndex !== null && activeQuestionIndex > index) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  // افزودن گزینه موقت
  const handleAddTempOption = () => {
    if (!optionLabel.trim() || !optionResponse.trim()) {
      return onShowMessage("error", "متن گزینه و پاسخ آن را وارد کنید.");
    }
    const newOpt: IOption = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      label: optionLabel.trim(),
      nextResponseText: optionResponse.trim(),
    };
    setTempOptions((prev) => [...prev, newOpt]);
    setOptionLabel("");
    setOptionResponse("");
  };

  const handleRemoveTempOption = (optId: string) => {
    setTempOptions((prev) => prev.filter((o) => o.id !== optId));
  };

  // ثبت پیام
  const handleAddMessage = () => {
    if (activeQuestionIndex === null || !questions[activeQuestionIndex]) {
      return onShowMessage("error", "ابتدا یک موضوع گفتگو را انتخاب کنید.");
    }
    if (!newMessageText.trim()) {
      return onShowMessage("error", "متن پیام نمی‌تواند خالی باشد.");
    }
    if (isInteractiveMode && tempOptions.length === 0) {
      return onShowMessage("error", "حداقل باید یک گزینه/دکمه اضافه کنید.");
    }

    const newMsg: IMessage = {
      id: `m_${Date.now()}`,
      sender: newMessageSender,
      text: newMessageText.trim(),
      options: isInteractiveMode && tempOptions.length > 0 ? tempOptions : undefined,
    };

    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === activeQuestionIndex
          ? { ...q, messages: [...q.messages, newMsg] }
          : q
      )
    );

    setNewMessageText("");
    setTempOptions([]);
    setIsInteractiveMode(false);
  };

  // حذف پیام
  const handleRemoveMessage = (qIndex: number, mIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === qIndex
          ? { ...q, messages: q.messages.filter((_, i) => i !== mIndex) }
          : q
      )
    );
  };

  // ذخیره تاپیک جدید
  const handleSubmitTopic = async (e: React.FormEvent) => {
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
        fetchExistingTopics(); // بروزرسانی لیست تاپیک‌های دیتابیس
      } else {
        onShowMessage("error", data.error || "خطا در ثبت تاپیک");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* بخش نمایش و مدیریت تاپیک‌های موجود در دیتابیس */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            تاپیک‌های فعال دیتابیس ({existingTopics.length})
          </h3>
          <button
            type="button"
            onClick={fetchExistingTopics}
            disabled={isLoadingTopics}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingTopics ? "animate-spin" : ""}`} />
          </button>
        </div>

        {existingTopics.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            هنوز تاپیکی در دیتابیس ثبت نشده است.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {existingTopics.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-xl hover:border-indigo-200 transition"
              >
                <div>
                  <div className="font-bold text-sm text-gray-800">{item.title}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                    <span>اسلاگ: {item.slug}</span>
                    <span>•</span>
                    <span>{item.questions?.length || 0} موضوع</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteExistingTopic(item._id, item.title)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="حذف کامل تاپیک"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* فرم ساخت تاپیک جدید */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <Plus className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">
            ایجاد تاپیک و چت جدید (گفتینو)
          </h2>
        </div>

        <form onSubmit={handleSubmitTopic} className="space-y-6 text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                عنوان تاپیک اصلی:
              </label>
              <input
                type="text"
                placeholder="مثال: انتخاب رشته انسانی"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                اسلاگ تاپیک (انگلیسی/یکتا):
              </label>
              <input
                type="text"
                placeholder="مثال: ensani-guidance"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              توضیحات کوتاه تاپیک (اختیاری):
            </label>
            <input
              type="text"
              placeholder="مثال: راهنمای کامل معرفی رشته‌ها و شغلی انسانی"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <hr className="my-4" />

          {/* بخش ساخت موضوعات گفتگو */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 text-base">
              ۱. ساخت موضوعات گفتگو برای این تاپیک
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="عنوان موضوع (مثال: چگونه وکیل بشیم؟)"
                value={currentQuestionTitle}
                onChange={(e) => setCurrentQuestionTitle(e.target.value)}
                className="flex-1 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition shrink-0"
              >
                <Plus className="w-4 h-4" /> افزودن موضوع
              </button>
            </div>

            {/* لیست موضوعات در حال ساخت */}
            {questions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-2 border text-xs font-bold transition ${
                      activeQuestionIndex === idx
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span>{q.title}</span>
                    <span className="bg-white/20 text-current px-1.5 py-0.5 rounded text-[10px]">
                      {q.messages.length} پیام
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveQuestion(idx);
                      }}
                      className="hover:text-red-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* بخش تنظیم چت موضوع انتخاب‌شده */}
          {activeQuestionIndex !== null && questions[activeQuestionIndex] && (
            <div className="space-y-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 text-base">
                ۲. تنظیم چت برای موضوع: «{questions[activeQuestionIndex].title}»
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto p-3 bg-white rounded-xl border border-gray-200">
                {questions[activeQuestionIndex].messages.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">
                    هنوز هیچ پیامی برای این موضوع اضافه نشده است.
                  </p>
                ) : (
                  questions[activeQuestionIndex].messages.map((m, mIdx) => (
                    <div
                      key={m.id || mIdx}
                      className={`p-2.5 rounded-lg text-xs space-y-2 border-r-4 ${
                        m.sender === "advisor"
                          ? "bg-blue-50 border-blue-500"
                          : "bg-emerald-50 border-emerald-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold ml-2">
                            {m.sender === "advisor" ? "👨‍🏫 مشاور:" : "🎓 دانش‌آموز:"}
                          </span>
                          <span>{m.text}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMessage(activeQuestionIndex, mIdx)}
                          className="text-red-500 hover:text-red-700 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {m.options && m.options.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                            <GitBranch className="w-3 h-3 text-indigo-600" /> گزینه‌های انتخابی کاربر:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.options.map((opt) => (
                              <div
                                key={opt.id}
                                className="bg-white p-2 rounded border border-gray-200 text-[11px]"
                              >
                                <div className="font-bold text-indigo-600">🔘 {opt.label}</div>
                                <div className="text-gray-600 flex items-center gap-1 mt-0.5">
                                  <CornerDownLeft className="w-3 h-3 text-gray-400 shrink-0" />
                                  پاسخ: {opt.nextResponseText}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ورودی پیام جدید */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700 text-xs">افزودن پیام جدید:</span>
                  <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInteractiveMode}
                      onChange={(e) => setIsInteractiveMode(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>این پیام دارای گزینه‌های انتخابی (دکمه‌ها) باشد</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={newMessageSender}
                    onChange={(e) =>
                      setNewMessageSender(e.target.value as "student" | "advisor")
                    }
                    className="border border-gray-200 p-2.5 rounded-lg bg-white font-medium focus:outline-none"
                  >
                    <option value="advisor">👨‍🏫 مشاور</option>
                    <option value="student">🎓 دانش‌آموز</option>
                  </select>
                  <input
                    type="text"
                    placeholder={
                      isInteractiveMode
                        ? "سوال یا پیام مقدماتی..."
                        : "متن پیام..."
                    }
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                {isInteractiveMode && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-indigo-300 space-y-3">
                    <span className="text-xs font-bold text-gray-700 block">
                      افزودن گزینه‌ها و پاسخ آن‌ها:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="عنوان گزینه/سوال"
                        value={optionLabel}
                        onChange={(e) => setOptionLabel(e.target.value)}
                        className="border border-gray-200 p-2 rounded-lg text-xs bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="پاسخ مشاور..."
                        value={optionResponse}
                        onChange={(e) => setOptionResponse(e.target.value)}
                        className="border border-gray-200 p-2 rounded-lg text-xs bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTempOption}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2 rounded-lg font-bold transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> افزودن این گزینه
                    </button>

                    {tempOptions.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {tempOptions.map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-xs"
                          >
                            <div className="truncate pl-2">
                              <span className="font-bold text-indigo-600 ml-2">🔘 {opt.label}</span>
                              <span className="text-gray-600">➔ {opt.nextResponseText}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTempOption(opt.id)}
                              className="text-red-500 hover:text-red-700 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddMessage}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1"
                >
                  <Send className="w-4 h-4" /> ثبت پیام در چت
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white p-3.5 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-base"
          >
            <Save className="w-5 h-5" /> ذخیره تاپیک و چت‌ها در دیتابیس (MongoDB)
          </button>
        </form>
      </div>
    </div>
  );
}