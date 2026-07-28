// مسیر فایل: src/component/adminpaneldet/AdminArticlesPanel.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Image as ImageIcon, Edit, X, RefreshCw } from "lucide-react";

export interface IBlock {
  type: "text" | "image";
  content: string;
  caption?: string;
}

export interface IArticleData {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  blocks: IBlock[];
  createdAt?: string;
}

interface AdminArticlesPanelProps {
  onShowMessage?: (type: "success" | "error", msg: string) => void;
}

export default function AdminArticlesPanel({ onShowMessage }: AdminArticlesPanelProps) {
  // استیت‌های فرم
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  
  // استیت‌های لیست و لودینگ
  const [articles, setArticles] = useState<IArticleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);

  // دریافت لیست مقالات از سرور (ایمن‌سازی شده)
  const fetchArticles = async () => {
    setFetchingList(true);
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setArticles(data);
        } else if (data && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          setArticles([]);
        }
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("خطا در دریافت لیست مقالات:", err);
      setArticles([]);
    } finally {
      setFetchingList(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // پاک‌سازی فرم و خروج از حالت ویرایش
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setBlocks([]);
  };

  // انتخاب مقاله برای ویرایش
  const handleEditClick = (article: IArticleData) => {
    setEditingId(article._id || null);
    setTitle(article.title);
    setSlug(article.slug);
    setSummary(article.summary || "");
    setBlocks(article.blocks || []);
    
    // اسکرول نرم به بالای فرم
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // مدیریت بلوک‌ها
  const addTextBlock = () => {
    setBlocks((prev) => [...prev, { type: "text", content: "" }]);
  };

  const addImageBlock = () => {
    setBlocks((prev) => [...prev, { type: "image", content: "", caption: "" }]);
  };

  const updateBlock = (index: number, fields: Partial<IBlock>) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      return updated;
    });
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  // ثبت یا به‌روزرسانی مقاله
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      if (onShowMessage) onShowMessage("error", "لطفاً عنوان و اسلاگ را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { _id: editingId, title, slug, summary, blocks }
        : { title, slug, summary, blocks };

      const res = await fetch("/api/articles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const msg = editingId ? "مقاله با موفقیت به‌روزرسانی شد" : "مقاله جدید با موفقیت ثبت شد";
        if (onShowMessage) onShowMessage("success", msg);
        resetForm();
        fetchArticles(); // بروزرسانی جدول لیست
      } else {
        const errorData = await res.json();
        if (onShowMessage) onShowMessage("error", errorData.message || "خطا در ذخیره‌سازی مقاله");
      }
    } catch (err) {
      if (onShowMessage) onShowMessage("error", "خطای شبکه یا سرور");
    } finally {
      setLoading(false);
    }
  };

  // حذف مقاله
  const handleDelete = async (id: string, articleTitle: string) => {
    if (!confirm(`آیا از حذف مقاله "${articleTitle}" اطمینان دارید؟`)) return;

    try {
      const res = await fetch(`/api/articles?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onShowMessage) onShowMessage("success", "مقاله با موفقیت حذف شد");
        if (editingId === id) resetForm(); // اگر در حال ویرایش همین مقاله بود فرم خالی شود
        fetchArticles();
      } else {
        const errorData = await res.json();
        if (onShowMessage) onShowMessage("error", errorData.message || "خطا در حذف مقاله");
      }
    } catch (err) {
      if (onShowMessage) onShowMessage("error", "خطای ارتباط با سرور");
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* فرم ثبت / ویرایش مقاله */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold text-text-primary">
            {editingId ? "ویرایش مقاله" : "ایجاد مقاله جدید"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 text-xs text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors font-bold"
            >
              <X className="w-4 h-4" />
              <span>انصراف از ویرایش</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* عنوان مقاله */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              عنوان مقاله
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان مقاله..."
              className="w-full p-3 text-sm bg-bg border border-border rounded-xl focus:outline-none"
            />
          </div>

          {/* اسلاگ مقاله */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              اسلاگ (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="مثلاً: basic-components"
              className="w-full p-3 text-sm bg-bg border border-border rounded-xl focus:outline-none text-left"
              dir="ltr"
            />
          </div>

          {/* خلاصه مقاله */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              خلاصه مقاله (اختیاری)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="توضیح کوتاه درباره مقاله..."
              className="w-full p-3 text-sm bg-bg border border-border rounded-xl focus:outline-none resize-y"
            />
          </div>

          {/* بلوک‌های محتوا */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-text-primary mb-3">
              محتوای مقاله (پاراگراف‌ها و تصاویر)
            </label>

            <div className="space-y-3">
              {Array.isArray(blocks) && blocks.map((block, index) => (
                <div
                  key={index}
                  className="p-4 bg-bg border border-border rounded-2xl space-y-3 relative"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-text-secondary border-b border-border pb-2">
                    <span>
                      {block.type === "text" ? `پاراگراف ${index + 1}` : `تصویر ${index + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {block.type === "text" ? (
                    <textarea
                      rows={3}
                      placeholder="متن پاراگراف..."
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      className="w-full p-2.5 text-sm bg-surface border border-border rounded-xl focus:outline-none resize-y"
                    />
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="آدرس تصویر (URL)..."
                        value={block.content}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        className="w-full p-2.5 text-sm bg-surface border border-border rounded-xl focus:outline-none text-left"
                        dir="ltr"
                      />
                      <input
                        type="text"
                        placeholder="توضیح زیر عکس (اختیاری)..."
                        value={block.caption || ""}
                        onChange={(e) => updateBlock(index, { caption: e.target.value })}
                        className="w-full p-2 text-xs bg-surface border border-border rounded-xl focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* دکمه‌های افزودن بلوک */}
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={addTextBlock}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface hover:bg-bg border border-border text-xs font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4 text-secondary" />
                <span>افزودن پاراگراف</span>
              </button>

              <button
                type="button"
                onClick={addImageBlock}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface hover:bg-bg border border-border text-xs font-bold rounded-xl transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-accent" />
                <span>افزودن تصویر</span>
              </button>
            </div>
          </div>

          {/* دکمه اصلی ثبت / ذخیره */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 mt-4"
          >
            {loading ? "در حال ذخیره‌سازی..." : editingId ? "ذخیره تغییرات" : "ثبت مقاله"}
          </button>
        </form>
      </div>

      {/* جدول / لیست مقالات ثبت‌شده */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-lg font-bold text-text-primary">مدیریت مقالات موجود</h3>
          <button
            onClick={fetchArticles}
            className="p-2 hover:bg-bg rounded-xl text-text-secondary transition-colors"
            title="بروزرسانی لیست"
          >
            <RefreshCw className={`w-4 h-4 ${fetchingList ? "animate-spin" : ""}`} />
          </button>
        </div>

        {fetchingList ? (
          <p className="text-xs text-text-secondary text-center py-6">در حال دریافت مقالات...</p>
        ) : !Array.isArray(articles) || articles.length === 0 ? (
          <p className="text-xs text-text-secondary text-center py-6">هنوز مقاله‌ای ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {articles.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 bg-bg border border-border rounded-2xl gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-sm text-text-primary truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-secondary truncate dir-ltr text-right">
                    /{item.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* دکمه ویرایش */}
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 bg-surface hover:bg-secondary/10 text-secondary border border-border rounded-xl transition-colors"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* دکمه حذف */}
                  <button
                    onClick={() => item._id && handleDelete(item._id, item.title)}
                    className="p-2 bg-surface hover:bg-rose-50 text-rose-500 border border-border rounded-xl transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}