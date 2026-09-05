"use client";

import React, { useState } from "react";
import { Plus, Link2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  onShowMessage?: (type: "success" | "error", text: string) => void;
}

export default function AdminShowcasePanel({ onShowMessage }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    folder: "",
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  
  // 🔹 State جدید برای مدیریت پیام داخلی فرم
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 🔹 ساخت اسلاگ آزمایشی برای پیش‌نمایش در فرم
  const previewSlug = (formData.slug || formData.title || formData.folder)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // پاک کردن پیام قبلی

    if (!formData.title || !formData.folder) {
      const errText = "لطفاً تمامی فیلدهای الزامی (*) را پر کنید.";
      setMessage({ type: "error", text: errText });
      onShowMessage?.("error", errText);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        const successText = "آلبوم جدید با موفقیت در ویترین ایجاد شد.";
        setMessage({ type: "success", text: successText });
        onShowMessage?.("success", successText);
        setFormData({ title: "", slug: "", folder: "", description: "", date: "" });
      } else {
        const errText = data.error || "خطا در ثبت آلبوم";
        setMessage({ type: "error", text: errText });
        onShowMessage?.("error", errText);
      }
    } catch {
      const errText = "خطا در برقراری ارتباط با سرور";
      setMessage({ type: "error", text: errText });
      onShowMessage?.("error", errText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm dir-rtl font-[iranSans-r]">
      <h2 className="text-xl font-[iranBold] text-slate-900 mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-teal-600" />
        ایجاد آلبوم جدید در ویترین علمی
      </h2>

      {/* 🔹 باکس نمایش پیام موفقیت یا ارور */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm transition-all duration-300 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-[iranBold] text-slate-700 mb-1">
              عنوان آلبوم *
            </label>
            <input
              type="text"
              placeholder="مثال: نمایشگاه کتاب"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-[iranBold] text-slate-700 mb-1">
              نام دقیق پوشه Cloudinary (folder) *
            </label>
            <input
              type="text"
              placeholder="مثال: ketabkhaneh99"
              value={formData.folder}
              onChange={(e) =>
                setFormData({ ...formData, folder: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 text-left dir-ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-[iranBold] text-slate-700 mb-1">
              پیوند یکتا (Slug - اختیاری)
            </label>
            <input
              type="text"
              placeholder="مثال: book-expo-1405 (خالی بگذارید تا خودکار ساخته شود)"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 text-left dir-ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-[iranBold] text-slate-700 mb-1">
              تاریخ رویداد
            </label>
            <input
              type="text"
              placeholder="مثال: ۱۴۰۵/۰۵/۱۲"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* پیش‌نمایش آدرس URL */}
        {previewSlug && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 dir-ltr overflow-x-auto">
            <Link2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-slate-400">آدرس آلبوم:</span>
            <span className="font-mono text-slate-700">/showcase/{previewSlug}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-[iranBold] text-slate-700 mb-1">
            توضیحات آلبوم
          </label>
          <textarea
            rows={3}
            placeholder="توضیح کوتاهی درباره رویداد..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-[iranBold] transition duration-200 shadow-md disabled:opacity-50"
        >
          {loading ? "در حال دریافت کاور و ثبت آلبوم..." : "ذخیره و انتشار آلبوم"}
        </button>
      </form>
    </div>
  );
}