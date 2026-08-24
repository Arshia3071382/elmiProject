// Questions manager
import { Plus, Trash2 } from "lucide-react";
import { IQuestion } from "./constants";

interface QuestionsManagerProps {
  questions: IQuestion[];
  activeIndex: number | null;
  currentTitle: string;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSelect: (index: number) => void;
}

export default function QuestionsManager({
  questions,
  activeIndex,
  currentTitle,
  onTitleChange,
  onAdd,
  onRemove,
  onSelect,
}: QuestionsManagerProps) {
  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h3 className="font-bold text-gray-800 text-base">
        ۱. ساخت موضوعات گفتگو برای این تاپیک
      </h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="عنوان موضوع (مثال: چگونه وکیل بشیم؟)"
          value={currentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="flex-1 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
        />
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition shrink-0"
        >
          <Plus className="w-4 h-4" /> افزودن موضوع
        </button>
      </div>

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => onSelect(idx)}
              className={`cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-2 border text-xs font-bold transition ${
                activeIndex === idx
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
                  onRemove(idx);
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
  );
}