'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function AdminStoryForm({ onStoryAdded }: { onStoryAdded?: () => void }) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // اینجا لینک Supabase وارد می‌شود
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          image: imageUrl, // ارسال لینک Supabase به سمت سرور/دیتابیس
          link,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTitle('');
        setImageUrl('');
        setLink('');
        if (onStoryAdded) onStoryAdded();
        alert('استوری با موفقیت ثبت شد!');
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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xl mx-auto dir-rtl">
      <h2 className="text-sm font-bold text-slate-800 mb-4">افزودن استوری جدید (با لینک سوپابیس)</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* عنوان استوری */}
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

        {/* لینک تصویر Supabase */}
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

        {/* پیش‌نمایش زنده تصویر */}
        {imageUrl && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
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

        {/* لینک دکمه اقدام (اختیاری) */}
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

        {/* دکمه ثبت */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره و انتشار استوری'}
        </button>
      </form>
    </div>
  );
}