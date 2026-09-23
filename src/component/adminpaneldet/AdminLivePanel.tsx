// src/component/adminpaneldet/AdminLivePanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tv, Calendar, CheckCircle } from "lucide-react";

export default function AdminLivePanel() {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    host: "",
    date: "",
    time: "",
    category: "",
    description: "",
    aparatEmbedUrl: "",
    guests: "",
    isCurrentLive: false,
  });

  const fetchStreams = async () => {
    try {
      const res = await fetch("/api/admin/live");
      const data = await res.json();
      if (data.success) setStreams(data.streams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...form,
      guests: form.guests ? form.guests.split(",").map((g) => g.trim()) : [],
    };

    const res = await fetch("/api/admin/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    const data = await res.json();
    if (data.success) {
      alert("برنامه با موفقیت ثبت شد!");
      setForm({
        title: "",
        host: "",
        date: "",
        time: "",
        category: "",
        description: "",
        aparatEmbedUrl: "",
        guests: "",
        isCurrentLive: false,
      });
      fetchStreams();
    } else {
      alert("خطا در ثبت برنامه");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این برنامه مطمئن هستید؟")) return;
    const res = await fetch(`/api/admin/live/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fetchStreams();
    }
  };

  return (
    <div className="space-y-8 font-[iranSans-r] dir-rtl text-right">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h3 className="font-[iranBold] text-lg text-primary mb-4 flex items-center gap-2">
          <Tv className="w-5 h-5 text-secondary" />
          افزودن / مدیریت پخش زنده و جدول پخش
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="عنوان برنامه"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="text"
            placeholder="نام مجری"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="text"
            placeholder="تاریخ (مثال: ۱۴۰۳/۰۸/۱۵)"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="text"
            placeholder="زمان (مثال: ۱۸:۰۰)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="text"
            placeholder="دسته‌بندی"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="text"
            placeholder="مهمانان (با کاما جدا کنید)"
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary"
          />
          <textarea
            placeholder="توضیحات برنامه"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary md:col-span-2"
          />
          <textarea
            placeholder="کد Embed یا تگ iframe آپارات"
            value={form.aparatEmbedUrl}
            onChange={(e) => setForm({ ...form, aparatEmbedUrl: e.target.value })}
            className="p-3 bg-slate-50 rounded-xl border border-zinc-200 text-sm outline-none focus:border-primary md:col-span-2 font-mono text-left"
            dir="ltr"
            required
          />

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              id="isCurrentLive"
              checked={form.isCurrentLive}
              onChange={(e) => setForm({ ...form, isCurrentLive: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="isCurrentLive" className="text-sm text-text-secondary cursor-pointer">
              تنظیم به عنوان پخش زنده فعال فعلی (نمایش در صفحه اصلی پخش زنده)
            </label>
          </div>

          <button
            type="submit"
            className="md:col-span-2 py-3 bg-primary text-white rounded-xl font-[iranBold] text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            ذخیره برنامه
          </button>
        </form>
      </div>

      {/* لیست برنامه‌های ثبت شده */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h4 className="font-[iranBold] text-base text-primary mb-4">لیست برنامه‌های ثبت شده</h4>
        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-text-secondary">در حال بارگذاری...</p>
          ) : streams.length > 0 ? (
            streams.map((item) => (
              <div key={item._id} className="p-4 bg-slate-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-[iranBold] text-sm text-primary">{item.title}</h5>
                    {item.isCurrentLive && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-[iranBold]">
                        <CheckCircle className="w-3 h-3" /> زنده فعال
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">مجری: {item.host} | تاریخ: {item.date} - {item.time}</p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-text-secondary">هیچ برنامه‌ای ثبت نشده است.</p>
          )}
        </div>
      </div>
    </div>
  );
}