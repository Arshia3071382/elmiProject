"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Loader2, Sparkles, HelpCircle } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--color-bg)] p-4 sm:p-8 font-['iranSans-r'] relative overflow-hidden" dir="rtl">
      {/* هاله نور تزئینی پس‌زمینه */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* هدر اصلی */}
        <div className="text-center my-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-secondary)] text-xs font-['iranBold']">
            <Sparkles className="w-3.5 h-3.5" />
            راهنمای هوشمند انتخاب مسیر
          </div>
          <h1 className="text-2xl sm:text-4xl font-['iranBold'] text-[var(--color-primary)] tracking-tight">
            گفتینو | مشاوره هوشمند انتخاب رشته
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
            یکی از موضوعات زیر را انتخاب کنید تا پاسخ سوالات و راهنمایی‌های اختصاصی مشاور را مشاهده کنید.
          </p>
        </div>

        {/* وضعیت بارگذاری */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-9 h-9 text-[var(--color-secondary)] animate-spin" />
            <span className="text-xs text-[var(--color-text-secondary)] font-['iranBold']">در حال دریافت موضوعات...</span>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <HelpCircle className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-50" />
            <p className="text-sm font-['iranBold'] text-[var(--color-text-primary)]">هنوز هیچ تاپیکی ایجاد نشده است.</p>
          </div>
        ) : (
          /* شبکه کارت‌های تاپیک */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <Link
                key={topic._id}
                href={`/chat-guidance/chat?t=${topic.slug}`}
                className="group relative bg-[var(--color-surface)] rounded-3xl p-6 border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/40 flex flex-col justify-between overflow-hidden"
              >
                {/* نوار گرادینت تزئینی بالای کارت هنگام هوور */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-[var(--color-secondary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* بخش بالا: آیکون و تعداد موضوعات */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-secondary)]/10 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-secondary)] group-hover:scale-110 group-hover:bg-[var(--color-secondary)] group-hover:text-[var(--color-text-invert)] transition-all duration-300 shadow-sm">
                      <MessageSquare className="w-6 h-6" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-['iranBold'] bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/40 group-hover:text-[var(--color-primary)] transition-colors">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span>
                      {topic.questions?.length || 0} زیر‌موضوع
                    </span>
                  </div>

                  {/* عنوان و توضیحات */}
                  <h2 className="text-lg font-['iranBold'] text-[var(--color-text-primary)] group-hover:text-[var(--color-secondary)] transition-colors mb-2">
                    {topic.title}
                  </h2>

                  {topic.description ? (
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-6 mb-6">
                      {topic.description}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--color-text-secondary)]/60 italic mb-6">
                      توضیحاتی برای این موضوع ثبت نشده است.
                    </p>
                  )}
                </div>

                {/* فوتر کارت: دکمه اکشن */}
                <div className="pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs font-['iranBold'] text-[var(--color-text-secondary)] group-hover:text-[var(--color-secondary)] transition-colors">
                  <span>شروع گفتگو و سوالات</span>
                  <div className="flex items-center gap-1 bg-[var(--color-bg)] group-hover:bg-[var(--color-secondary)] group-hover:text-[var(--color-text-invert)] px-3 py-1.5 rounded-xl border border-[var(--color-border)] group-hover:border-transparent transition-all duration-300">
                    <span className="text-[11px]">ورود</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}