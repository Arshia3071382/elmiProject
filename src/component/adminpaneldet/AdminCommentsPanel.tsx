"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Star, User, BookOpen, MessageSquare } from "lucide-react";

export default function AdminCommentsPanel() {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [coursesCount, setCoursesCount] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment || !coursesCount) {
      alert("لطفاً فیلدهای نام، متن نظر و دوره را پر کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, coursesCount, rating }),
      });

      if (res.ok) {
        setName("");
        setComment("");
        setCoursesCount("");
        setRating(5);
        fetchComments();
      } else {
        alert("خطا در ثبت نظر");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // اصلاح شده: ارسال آیدی به صورت Route Parameter برای هماهنگی با فایل [id]/route.ts
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این نظر مطمئن هستید؟")) return;

    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchComments();
      } else {
        alert("خطا در حذف نظر از سرور");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <span>مدیریت نظرات دانشجویان</span>
        </h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl font-bold">
          تعداد کل: {comments.length}
        </span>
      </div>

      {/* فرم ثبت نظر جدید */}
      <form onSubmit={handleAddComment} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 space-y-4">
        <h4 className="font-bold text-gray-700 text-sm mb-2">ثبت نظر جدید (تاریخ به صورت خودکار درج می‌شود)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">نام دانشجو</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: علی رضایی"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">تعداد دوره‌ها / مقطع</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={coursesCount}
                onChange={(e) => setCoursesCount(e.target.value)}
                placeholder="مثال: شرکت در ۳ دوره"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">تعداد ستاره (امتیاز)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (۵ ستاره)</option>
              <option value={4}>⭐⭐⭐⭐ (۴ ستاره)</option>
              <option value={3}>⭐⭐⭐ (۳ ستاره)</option>
              <option value={2}>⭐⭐ (۲ ستاره)</option>
              <option value={1}>⭐ (۱ ستاره)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">متن نظر دانشجو</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="متن نظر را اینجا وارد کنید..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? "در حال ثبت..." : "ثبت و افزودن نظر"}</span>
        </button>
      </form>

      {/* لیست نظرات موجود */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comments.map((item) => (
          <div key={item._id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-mono">{item.date}</span>
              </div>
              <p className="text-gray-700 text-sm leading-7 mb-4">{item.comment}</p>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
              <div>
                <span className="font-bold text-gray-900 text-sm ml-2">{item.name}</span>
                <span className="text-xs bg-slate-100 text-gray-600 px-2.5 py-1 rounded-lg">{item.coursesCount}</span>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="حذف نظر"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}