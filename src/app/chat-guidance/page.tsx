"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Loader2 } from "lucide-react";

export default function ChatGuidancePage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat/topics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTopics(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dir-rtl p-4 sm:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center my-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
            گفتینو | مشاوره هوشمند انتخاب رشته
          </h1>
          <p className="text-sm text-gray-500">
            لطفاً تاپیک مورد نظر خود را جهت شروع گفتگو انتخاب کنید:
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            هنوز هیچ تاپیکی ایجاد نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <Link
                key={topic._id}
                href={`/chat-guidance/chat?t=${topic.slug}`}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition group flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-bold text-gray-800 group-hover:text-indigo-600 transition">
                      {topic.title}
                    </h2>
                  </div>
                  {topic.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {topic.description}
                    </p>
                  )}
                  <span className="inline-block mt-3 text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">
                    {topic.questions?.length || 0} موضوع گفتگو
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}