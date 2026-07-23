"use client";

import { useState } from "react";
import { Plus, Trash2, Send, Save, MessageSquare } from "lucide-react";

interface IMessage {
  sender: "advisor" | "student";
  text: string;
}

interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

export default function AdminTopicsPanel({
  onShowMessage,
}: {
  onShowMessage: (type: "success" | "error", text: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState("");

  // نگه داشتن سوال انتخاب شده جهت اضافه کردن پیام به آن
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  
  // فیلدهای اضافه کردن پیام
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageSender, setNewMessageSender] = useState<"student" | "advisor">("student");

  // افزودن موضوع جدید به تاپیک
  const handleAddQuestion = () => {
    if (!currentQuestionTitle.trim()) {
      return onShowMessage("error", "عنوان موضوع گفتگو را وارد کنید.");
    }
    const newQ: IQuestion = {
      id: `q_${Date.now()}`,
      title: currentQuestionTitle.trim(),
      messages: [],
    };
    setQuestions((prev) => [...prev, newQ]);
    setCurrentQuestionTitle("");
    if (activeQuestionIndex === null) {
      setActiveQuestionIndex(questions.length);
    }
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

  // افزودن پیام به موضوع فعال
  const handleAddMessage = () => {
    if (activeQuestionIndex === null) {
      return onShowMessage("error", "ابتدا یک موضوع گفتگو را انتخاب کنید.");
    }
    if (!newMessageText.trim()) {
      return onShowMessage("error", "متن پیام نمی‌تواند خالی باشد.");
    }

    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex].messages.push({
      sender: newMessageSender,
      text: newMessageText.trim(),
    });

    setQuestions(updatedQuestions);
    setNewMessageText("");
  };

  // حذف پیام
  const handleRemoveMessage = (qIndex: number, mIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].messages = updatedQuestions[qIndex].messages.filter(
      (_, i) => i !== mIndex
    );
    setQuestions(updatedQuestions);
  };

  // ذخیره کل تاپیک در مونگو
  const handleSubmitTopic = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug) {
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
          title,
          slug,
          description,
          questions,
        }),
      }).then((r) => r.json());

      if (res?.success) {
        onShowMessage("success", "تاپیک گفتینو با موفقیت در دیتابیس ذخیره شد.");
        setTitle("");
        setSlug("");
        setDescription("");
        setQuestions([]);
        setActiveQuestionIndex(null);
      } else {
        onShowMessage("error", res.error || "خطا در ثبت تاپیک");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">
          ایجاد تاپیک و چت جدید (گفتینو)
        </h2>
      </div>

      <form onSubmit={handleSubmitTopic} className="space-y-6 text-sm text-gray-700">
        {/* مشخصات کلی تاپیک */}
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

        {/* بخش افزودن موضوع گفتگو */}
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
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition"
            >
              <Plus className="w-4 h-4" /> افزودن موضوع
            </button>
          </div>

          {/* لیست موضوعات ساخته‌شده */}
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

        {/* بخش ساخت پیام‌های چت به صورت نوبتی */}
        {activeQuestionIndex !== null && questions[activeQuestionIndex] && (
          <div className="space-y-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 text-base flex items-center justify-between">
              <span>
                ۲. پیام‌های چت برای موضوع: «
                {questions[activeQuestionIndex].title}»
              </span>
            </h3>

            {/* لیست پیام‌های ثبت شده این موضوع */}
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
              {questions[activeQuestionIndex].messages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  هنوز هیچ پیامی برای این موضوع اضافه نشده است.
                </p>
              ) : (
                questions[activeQuestionIndex].messages.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className={`flex items-start justify-between p-2 rounded-lg text-xs ${
                      m.sender === "advisor"
                        ? "bg-blue-50 border-r-4 border-blue-500"
                        : "bg-emerald-50 border-r-4 border-emerald-500"
                    }`}
                  >
                    <div>
                      <span className="font-bold ml-2">
                        {m.sender === "advisor" ? "👨‍🏫 مشاور:" : "🎓 دانش‌آموز:"}
                      </span>
                      <span>{m.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMessage(activeQuestionIndex, mIdx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ورودی اضافه کردن پیام جدید */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newMessageSender}
                onChange={(e) =>
                  setNewMessageSender(e.target.value as "student" | "advisor")
                }
                className="border border-gray-200 p-2.5 rounded-lg bg-white font-medium focus:outline-none"
              >
                <option value="student">🎓 دانش‌آموز</option>
                <option value="advisor">👨‍🏫 مشاور</option>
              </select>
              <input
                type="text"
                placeholder="متن پیام را بنویسید..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddMessage}
                className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-bold transition"
              >
                <Send className="w-4 h-4" /> افزودن پیام
              </button>
            </div>
          </div>
        )}

        {/* دکمه ثبت نهایی در دیتابیس */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white p-3.5 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-base"
        >
          <Save className="w-5 h-5" /> ذخیره تاپیک و چت‌ها در دیتابیس (MongoDB)
        </button>
      </form>
    </div>
  );
}