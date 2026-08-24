// Existing topics list
import { MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { IExistingTopic } from "./constants";

interface ExistingTopicsListProps {
  topics: IExistingTopic[];
  isLoading: boolean;
  onRefresh: () => void;
  onDelete: (id: string, title: string) => void;
}

export default function ExistingTopicsList({
  topics,
  isLoading,
  onRefresh,
  onDelete,
}: ExistingTopicsListProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          تاپیک‌های فعال دیتابیس ({topics.length})
        </h3>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {topics.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          هنوز تاپیکی در دیتابیس ثبت نشده است.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((item) => (
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
                onClick={() => onDelete(item._id, item.title)}
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
  );
}