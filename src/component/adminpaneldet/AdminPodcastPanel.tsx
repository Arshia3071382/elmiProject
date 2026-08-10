'use client';
import React, { useState, useEffect } from 'react';
import { Headphones, Plus, Trash2, Sparkles, Radio } from 'lucide-react';

export default function AdminPodcastPanel() {
  const [podcasts, setPodcasts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPodcasts = async () => {
    try {
      const res = await fetch('/api/podcasts', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setPodcasts(data.data);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 👈 کلید اصلی رفع خطای 401 برای ارسال کوکی ادمین
        body: JSON.stringify({ title, description, audioUrl })
      });

      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        setTitle('');
        setDescription('');
        setAudioUrl('');
        fetchPodcasts();
      } else {
        alert(data.error || 'خطا در ثبت پادکست');
      }
    } catch (error) {
      setLoading(false);
      alert('خطا در ارتباط با سرور');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این پادکست مطمئن هستید؟')) return;
    try {
      const res = await fetch(`/api/podcasts/${id}`, { 
        method: 'DELETE',
        credentials: 'include' // 👈 ارسال کوکی برای عملیات حذف
      });
      const data = await res.json();
      if (data.success) fetchPodcasts();
    } catch (error) {
      console.error('Error deleting podcast:', error);
    }
  };

  return (
    <div dir="rtl" className="p-6 sm:p-8 bg-[var(--color-surface)] rounded-3xl shadow-sm border border-[var(--color-border)] font-[iranSans-r]">
      
      {/* هدر پنل */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center shrink-0">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-[iranBold] text-[var(--color-text-primary)]">مدیریت پادکست‌های آموزشی</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">انتشار و مدیریت اپیزودهای صوتی رادیو علمی منتظران</p>
        </div>
      </div>
      
      {/* فرم افزودن پادکست */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-10 bg-[var(--color-bg)] p-6 rounded-2xl border border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-sm font-[iranBold] text-[var(--color-primary)] mb-2">
          <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />
          <span>افزودن اپیزود جدید</span>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mb-1.5">عنوان پادکست</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-sm transition-all"
            placeholder="مثلاً: تحلیل و بررسی سوالات فیزیک کنکور"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mb-1.5">توضیحات کوتاه</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-sm transition-all resize-none"
            placeholder="توضیحاتی پیرامون محتوای این اپیزود صوتی..."
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mb-1.5">لینک فایل صوتی (آپلود شده)</label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-sm text-left transition-all"
            dir="ltr"
            placeholder="https://...supabase.co/storage/v1/object/public/..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[var(--color-secondary)] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-[iranBold] text-sm shadow-md shadow-[var(--color-secondary)]/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? 'در حال ثبت...' : 'انتشار پادکست'}</span>
        </button>
      </form>

      {/* لیست پادکست‌ها */}
      <div className="space-y-4">
        <h3 className="text-sm font-[iranBold] text-[var(--color-text-primary)] mb-3">اپیزودهای ثبت‌شده ({podcasts.length})</h3>
        
        {podcasts.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)] text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            هنوز پادکستی ثبت نشده است.
          </p>
        ) : (
          podcasts.map((pod: any) => (
            <div key={pod._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[var(--color-border)] rounded-2xl bg-white shadow-xs hover:shadow-md transition-all">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--color-secondary)] flex items-center justify-center shrink-0 mt-0.5">
                  <Radio className="w-5 h-5" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="font-[iranBold] text-sm sm:text-base text-[var(--color-text-primary)]">{pod.title}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate font-mono" dir="ltr">{pod.audioUrl}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(pod._id)}
                className="flex items-center justify-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-xs px-3.5 py-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف</span>
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}