"use client";

import { useState, useEffect } from "react";
import { MessageSquare, FileJson } from "lucide-react";

export default function AdminTopicsPanel() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat/topics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTopics(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">باکس‌های مشاوره</h2>
        <span className="text-sm text-gray-500 mr-2">({topics.length} مورد)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{topic.title}</h3>
                <p className="text-sm text-gray-500">{topic.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                  {topic.slug}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <FileJson className="w-3 h-3" />
              <span>{topic.file}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700">
          💡 تمام تاپیک‌ها به صورت فایل‌های JSON در مسیر <code className="bg-blue-100 px-2 py-0.5 rounded">src/data/</code> ذخیره شده‌اند.
        </p>
      </div>
    </div>
  );
}