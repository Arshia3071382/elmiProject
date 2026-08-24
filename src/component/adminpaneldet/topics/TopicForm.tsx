// Topic form
import { Plus, Save } from "lucide-react";
import QuestionsManager from "./QuestionsManager";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { IQuestion, IOption } from "./constants";

interface TopicFormProps {
  // Topic fields
  title: string;
  slug: string;
  description: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  
  // Questions
  questions: IQuestion[];
  activeQuestionIndex: number | null;
  currentQuestionTitle: string;
  onCurrentQuestionChange: (value: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  onSelectQuestion: (index: number) => void;
  
  // Messages
  onRemoveMessage: (qIndex: number, mIndex: number) => void;
  
  // Message form
  sender: "student" | "advisor";
  messageText: string;
  isInteractive: boolean;
  options: IOption[];
  optionLabel: string;
  optionResponse: string;
  onSenderChange: (value: "student" | "advisor") => void;
  onMessageTextChange: (value: string) => void;
  onToggleInteractive: (checked: boolean) => void;
  onOptionLabelChange: (value: string) => void;
  onOptionResponseChange: (value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onAddMessage: () => void;
  
  // Submit
  onSubmit: (e: React.FormEvent) => void;
}

export default function TopicForm({
  title,
  slug,
  description,
  onTitleChange,
  onSlugChange,
  onDescriptionChange,
  questions,
  activeQuestionIndex,
  currentQuestionTitle,
  onCurrentQuestionChange,
  onAddQuestion,
  onRemoveQuestion,
  onSelectQuestion,
  onRemoveMessage,
  sender,
  messageText,
  isInteractive,
  options,
  optionLabel,
  optionResponse,
  onSenderChange,
  onMessageTextChange,
  onToggleInteractive,
  onOptionLabelChange,
  onOptionResponseChange,
  onAddOption,
  onRemoveOption,
  onAddMessage,
  onSubmit,
}: TopicFormProps) {
  const activeQuestion = activeQuestionIndex !== null ? questions[activeQuestionIndex] : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Plus className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">
          ایجاد تاپیک و چت جدید (گفتینو)
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 text-sm text-gray-700">
        {/* Topic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              عنوان تاپیک اصلی:
            </label>
            <input
              type="text"
              placeholder="مثال: انتخاب رشته انسانی"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
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
              onChange={(e) => onSlugChange(e.target.value)}
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
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <hr className="my-4" />

        {/* Questions manager */}
        <QuestionsManager
          questions={questions}
          activeIndex={activeQuestionIndex}
          currentTitle={currentQuestionTitle}
          onTitleChange={onCurrentQuestionChange}
          onAdd={onAddQuestion}
          onRemove={onRemoveQuestion}
          onSelect={onSelectQuestion}
        />

        {/* Chat section */}
        {activeQuestion && (
          <div className="space-y-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 text-base">
              ۲. تنظیم چت برای موضوع: «{activeQuestion.title}»
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto p-3 bg-white rounded-xl border border-gray-200">
              <MessageList
                messages={activeQuestion.messages}
                onRemove={(mIndex) => onRemoveMessage(activeQuestionIndex!, mIndex)}
              />
            </div>

            <MessageForm
              sender={sender}
              text={messageText}
              isInteractive={isInteractive}
              options={options}
              optionLabel={optionLabel}
              optionResponse={optionResponse}
              onSenderChange={onSenderChange}
              onTextChange={onMessageTextChange}
              onToggleInteractive={onToggleInteractive}
              onOptionLabelChange={onOptionLabelChange}
              onOptionResponseChange={onOptionResponseChange}
              onAddOption={onAddOption}
              onRemoveOption={onRemoveOption}
              onAddMessage={onAddMessage}
            />
          </div>
        )}

        {/* Submit */}
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