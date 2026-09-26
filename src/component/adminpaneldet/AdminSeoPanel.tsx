"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Save, Globe } from "lucide-react";

interface AdminSeoPanelProps {
  onShowMessage?: (type: "success" | "error", text: string) => void;
}

interface ISeoData {
  title: string;
  description: string;
  keywords: string;
}

const SITE_URL = "https://elmi-montazeran.ir";
export default function AdminSeoPanel({ onShowMessage }: AdminSeoPanelProps) {
  const [data, setData] = useState<ISeoData>({ title: "", description: "", keywords: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSeo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setData({
          title: json.data.title || "",
          description: json.data.description || "",
          keywords: json.data.keywords || "",
        });
      }
    } catch (err) {
      console.error(err);
      onShowMessage?.("error", "خطا در دریافت تنظیمات سئو");
    } finally {
      setLoading(false);
    }
  }, [onShowMessage]);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  const handleSave = async () => {
    if (!data.title.trim() || !data.description.trim()) {
      onShowMessage?.("error", "عنوان و توضیحات الزامی هستند");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        onShowMessage?.("success", "تنظیمات سئو با موفقیت ذخیره شد");
      } else {
        onShowMessage?.("error", json.error || "خطا در ذخیره‌سازی");
      }
    } catch (err) {
      console.error(err);
      onShowMessage?.("error", "خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 font-bold">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        در حال بارگذاری تنظیمات سئو...
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800">تنظیمات سئو و موتور جستجوی گوگل (SEO)</h2>
          <p className="text-xs text-slate-500 font-[IRANSansXFaNum-Regular] mt-0.5">
            این بخش مشخص می‌کند وقتی نام سایت در گوگل سرچ می‌شود، عنوان و توضیحات چگونه نمایش داده شود.
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">عنوان صفحه اصلی (SEO Title)</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
          maxLength={70}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="مثال: منتظران ۳۱۳ | سامانه جامع فرهنگی، تربیتی"
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-slate-400 font-[IRANSansXFaNum-Regular]">
            توصیه می‌شود بین ۵۰ تا ۶۰ کاراکتر باشد و شامل کلمات کلیدی اصلی گردد.
          </span>
          <span className={`text-[11px] font-mono ${data.title.length > 60 ? "text-red-500" : "text-slate-400"}`}>
            {data.title.length}/60
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">توضیحات متای صفحه اصلی (Meta Description)</label>
        <textarea
          value={data.description}
          onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
          maxLength={200}
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="توضیح کوتاهی درباره سایت بنویسید..."
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-slate-400 font-[IRANSansXFaNum-Regular]">
            این متن به صورت خلاصه زیر عنوان در نتایج گوگل قرار می‌گیرد.
          </span>
          <span className={`text-[11px] font-mono ${data.description.length > 160 ? "text-red-500" : "text-slate-400"}`}>
            {data.description.length}/160
          </span>
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">کلمات کلیدی سئو (Keywords)</label>
        <input
          type="text"
          value={data.keywords}
          onChange={(e) => setData((prev) => ({ ...prev, keywords: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="منتظران, 313, منتظران 313, هیئت منتظران"
        />
        <span className="text-[11px] text-slate-400 font-[IRANSansXFaNum-Regular] mt-1.5 block">
          کلمات را با کاما (،) از هم جدا کنید.
        </span>
      </div>

      {/* Google Preview */}
      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-500">پیش‌نمایش نمایش در نتایج سرچ گوگل:</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="text-[13px] text-slate-600 mb-0.5 truncate">{SITE_URL}</div>
          <div className="text-lg text-blue-800 font-bold truncate">{data.title || "عنوان سایت"}</div>
          <div className="text-sm text-slate-600 mt-1 line-clamp-2">
            {data.description || "توضیحات سایت اینجا نمایش داده می‌شود."}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20"
      >
        <Save className="w-4 h-4" />
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات سئو"}
      </button>
    </div>
  );
}