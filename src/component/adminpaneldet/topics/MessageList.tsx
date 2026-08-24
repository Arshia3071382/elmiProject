// Message list
import { Trash2, GitBranch, CornerDownLeft } from "lucide-react";
import { IMessage } from "./constants";

interface MessageListProps {
  messages: IMessage[];
  onRemove: (index: number) => void;
}

export default function MessageList({ messages, onRemove }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <p className="text-xs text-gray-400 text-center py-4">
        هنوز هیچ پیامی برای این موضوع اضافه نشده است.
      </p>
    );
  }

  return (
    <>
      {messages.map((m, mIdx) => (
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
              onClick={() => onRemove(mIdx)}
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
      ))}
    </>
  );
}