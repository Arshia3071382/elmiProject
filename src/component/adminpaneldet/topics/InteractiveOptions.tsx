// Interactive options
import { Plus, Trash2 } from "lucide-react";
import { IOption } from "./constants";

interface InteractiveOptionsProps {
  options: IOption[];
  label: string;
  response: string;
  onLabelChange: (value: string) => void;
  onResponseChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export default function InteractiveOptions({
  options,
  label,
  response,
  onLabelChange,
  onResponseChange,
  onAdd,
  onRemove,
}: InteractiveOptionsProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-indigo-300 space-y-3">
      <span className="text-xs font-bold text-gray-700 block">
        افزودن گزینه‌ها و پاسخ آن‌ها:
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="عنوان گزینه/سوال"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="border border-gray-200 p-2 rounded-lg text-xs bg-white focus:outline-none"
        />
        <input
          type="text"
          placeholder="پاسخ مشاور..."
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          className="border border-gray-200 p-2 rounded-lg text-xs bg-white focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2 rounded-lg font-bold transition flex items-center justify-center gap-1"
      >
        <Plus className="w-3.5 h-3.5" /> افزودن این گزینه
      </button>

      {options.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {options.map((opt) => (
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
                onClick={() => onRemove(opt.id)}
                className="text-red-500 hover:text-red-700 shrink-0"
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