// Message form
import { Send } from "lucide-react";
import InteractiveOptions from "./InteractiveOptions";
import { IOption } from "./constants";

interface MessageFormProps {
  sender: "student" | "advisor";
  text: string;
  isInteractive: boolean;
  options: IOption[];
  optionLabel: string;
  optionResponse: string;
  onSenderChange: (value: "student" | "advisor") => void;
  onTextChange: (value: string) => void;
  onToggleInteractive: (checked: boolean) => void;
  onOptionLabelChange: (value: string) => void;
  onOptionResponseChange: (value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onAddMessage: () => void;
}

export default function MessageForm({
  sender,
  text,
  isInteractive,
  options,
  optionLabel,
  optionResponse,
  onSenderChange,
  onTextChange,
  onToggleInteractive,
  onOptionLabelChange,
  onOptionResponseChange,
  onAddOption,
  onRemoveOption,
  onAddMessage,
}: MessageFormProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700 text-xs">افزودن پیام جدید:</span>
        <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isInteractive}
            onChange={(e) => onToggleInteractive(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <span>این پیام دارای گزینه‌های انتخابی (دکمه‌ها) باشد</span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={sender}
          onChange={(e) => onSenderChange(e.target.value as "student" | "advisor")}
          className="border border-gray-200 p-2.5 rounded-lg bg-white font-medium focus:outline-none"
        >
          <option value="advisor">👨‍🏫 مشاور</option>
          <option value="student">🎓 دانش‌آموز</option>
        </select>
        <input
          type="text"
          placeholder={isInteractive ? "سوال یا پیام مقدماتی..." : "متن پیام..."}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="flex-1 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
        />
      </div>

      {isInteractive && (
        <InteractiveOptions
          options={options}
          label={optionLabel}
          response={optionResponse}
          onLabelChange={onOptionLabelChange}
          onResponseChange={onOptionResponseChange}
          onAdd={onAddOption}
          onRemove={onRemoveOption}
        />
      )}

      <button
        type="button"
        onClick={onAddMessage}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1"
      >
        <Send className="w-4 h-4" /> ثبت پیام در چت
      </button>
    </div>
  );
}