'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, AlertTriangle, CheckCircle2, PlusCircle } from 'lucide-react';

interface Story {
  _id?: string;
  id?: string;
  title?: string;
  image?: string;
  image_url?: string;
  link?: string;
  target_url?: string;
}

export default function AdminStoryForm({ onStoryAdded }: { onStoryAdded?: () => void }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // وضعیت‌های مربوط به مودال‌ها
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // دریافت لیست استوری‌ها
  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories');
      const data = await res.json();
      const items = data.stories || data || [];
      if (Array.isArray(items)) {
        setStories(items);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // ثبت استوری جدید
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('لطفاً لینک تصویر سوپابیس را وارد کنید.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          image: imageUrl,
          link,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTitle('');
        setImageUrl('');
        setLink('');
        fetchStories(); // به‌روزرسانی لیست
        if (onStoryAdded) onStoryAdded();
        
        // نمایش مودال موفقیت برای ثبت
        setSuccessMessage('استوری جدید با موفقیت ثبت و منتشر شد.');
        setIsSuccessModalOpen(true);
      } else {
        setError(data.message || 'خطا در ثبت استوری');
      }
    } catch (err) {
      console.error(err);
      setError('خطای شبکه رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  // کلیک روی دکمه حذف (باز شدن مودال هشدار)
  const handleDeleteClick = (id: string) => {
    setSelectedStoryId(id);
    setIsConfirmModalOpen(true);
  };

  // تأیید نهایی حذف
  const confirmDelete = async () => {
    if (!selectedStoryId) return;

    try {
      const res = await fetch(`/api/stories/${selectedStoryId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsConfirmModalOpen(false);
        setSelectedStoryId(null);
        fetchStories(); // به‌روزرسانی لیست

        // نمایش مودال موفقیت برای حذف
        setSuccessMessage('استوری مورد نظر با موفقیت حذف شد.');
        setIsSuccessModalOpen(true);
      } else {
        alert(data.error || 'خطا در حذف استوری');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 dir-rtl text-right">
      {/* فرم افزودن استوری */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-blue-600" />
          افزودن استوری جدید (لینک Supabase)
        </h2>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">عنوان استوری</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: همایش بزرگ علمی"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">لینک عمومی تصویر (Supabase Storage URL) *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://xxxxxx.supabase.co/storage/v1/object/public/..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              لینک Public URL تصویر آپلود شده در باکت Supabase را اینجا وارد کنید.
            </p>
          </div>

          {imageUrl && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
                onError={() => setError('لینک تصویر نامعتبر است یا لود نمی‌شود.')}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">لینک دکمه هدایت (اختیاری)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره و انتشار استوری'}
          </button>
        </form>
      </div>

      {/* بخش لیست استوری‌ها برای مدیریت و حذف */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-3">لیست استوری‌های فعال</h3>
        
        {stories.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">هیچ استوری ثبت نشده است.</p>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar-none">
            {stories.map((story) => {
              const id = story._id || story.id || '';
              const img = story.image || story.image_url || '';

              return (
                <div key={id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                      {img && <Image src={img} alt="" fill sizes="40px" className="object-cover" unoptimized />}
                    </div>
                    <span className="text-xs font-medium text-slate-700 max-w-[200px] truncate">
                      {story.title || 'بدون عنوان'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(id)}
                    className="p-2 text-red-500 hover:bg-red-100/60 rounded-lg transition"
                    title="حذف استوری"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* مودال اطمینان از حذف */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">آیا از حذف این استوری اطمینان دارید؟</h4>
            <p className="text-xs text-slate-500 mb-5">این استوری از سایت حذف خواهد شد و قابل بازگشت نیست.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
              >
                انصراف
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال موفقیت (برای ثبت و حذف) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">عملیات موفقیت‌آمیز</h4>
            <p className="text-xs text-slate-500 mb-5">{successMessage}</p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}