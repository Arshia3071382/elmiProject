"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, HelpCircle, Sparkles } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  likes: number;
  createdAt: string;
}

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.articles || []);
          if (data.userLikedIds) {
            setLikedIds(data.userLikedIds);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // جلوگیری از ریدایرکت هنگام کلیک روی دکمه لایک
    if (likedIds.includes(id)) return;

    try {
      const res = await fetch(`/api/articles/${id}/like`, { method: "POST" }).then((r) => r.json());
      if (res.success || res.likes !== undefined) {
        setArticles((prev) =>
          prev.map((art) => (art._id === id ? { ...art, likes: res.likes } : art))
        );
        setLikedIds((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50/50 to-white dir-rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* هدر بخش */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full mb-3 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>پاسخ به چالش‌های ذهن شما</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              اتاق فکر دانش‌آموزی
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              پاسخ به سوالاتی که هیچ‌کس در مدرسه به شما جواب نمی‌دهد!
            </p>
          </div>
        </div>

        {/* شبکه‌بندی کارت‌های سوال */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const isLiked = likedIds.includes(article._id);

            return (
              <Link
                key={article._id}
                href={`/articles/${article.slug}`}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  {/* آیکون و دکمه لایک */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <HelpCircle className="w-5 h-5" />
                    </span>

                    <button
                      onClick={(e) => handleLike(e, article._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isLiked
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{article.likes}</span>
                    </button>
                  </div>

                  {/* عنوان و توضیحات کوتاه */}
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
                    {article.title}
                  </h3>

                  {article.summary && (
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
                      {article.summary}
                    </p>
                  )}
                </div>

                {/* فوتر کارت */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-[-4px] transition-transform">
                  <span>مطالعه مقاله</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}