"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/component/Container";
import { Heart, ArrowLeft, HelpCircle, Compass } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  likes: number;
  createdAt: string;
}

export default function CuriosityPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/articles", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // مطمئن می‌شویم داده حتماً آرایه است تا map ارور ندهد
          setArticles(Array.isArray(data.articles) ? data.articles : []);
          if (Array.isArray(data.userLikedIds)) {
            setLikedIds(data.userLikedIds);
          }
        } else {
          setArticles([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);
  
  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
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

  return (
    <main className="py-16 min-h-screen bg-bg font-[iranSans-r] text-text-primary" dir="rtl">
      <Container>
        {/* هدر صفحه */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-4 border border-secondary/20">
            <Compass className="w-4 h-4 text-secondary" />
            <span>ایستگاه کنجکاوی</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-[iranBold] text-primary mb-3 tracking-tight">
            موضوع مورد علاقه‌ات رو انتخاب کن!
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            مجموعه‌ای از مقالات، سوالات و چالش‌های فکری که دیدگاهت رو نسبت به درس و مسیر زندگی تغییر میده.
          </p>
        </div>

        {/* حالت لودینگ */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-surface rounded-2xl animate-pulse border border-border" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-2xl border border-border">
            <p className="text-text-secondary text-sm font-medium">هنوز موضوعی اضافه نشده است.</p>
          </div>
        ) : (
          /* شبکه‌بندی کارت موضوعات */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const isLiked = likedIds.includes(article._id);

              return (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug}`}
                  className="group bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-right"
                >
                  <div>
                    {/* آیکون و لایک */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="p-2.5 bg-secondary/10 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-text-invert transition-colors duration-300">
                        <HelpCircle className="w-5 h-5" />
                      </span>

                      <button
                        onClick={(e) => handleLike(e, article._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isLiked
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-bg text-text-secondary hover:bg-rose-50 hover:text-rose-600 border border-border/50"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{article.likes}</span>
                      </button>
                    </div>

                    {/* عنوان موضوع */}
                    <h2 className="text-lg font-[iranBold] text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug mb-2 text-right">
                      {article.title}
                    </h2>

                    {article.summary && (
                      <p className="text-text-secondary text-xs leading-relaxed line-clamp-3 mb-4 text-right">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  {/* دکمه ورود به موضوع */}
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-secondary group-hover:-translate-x-1 transition-transform">
                    <span>ورود به این موضوع</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}