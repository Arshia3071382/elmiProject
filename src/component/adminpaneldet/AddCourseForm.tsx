"use client";

import React, { useState } from "react";
import { Plus, Clock, Video } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface AddCourseFormProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  onAddCourse: (formData: FormData) => Promise<boolean>;
  coursesCount: (id: string) => number;
}

export default function AddCourseForm({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCourse,
}: AddCourseFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedCategory) return;

    setLoading(true);

    let finalVideoUrl = videoUrl.trim();

    // ⚡️ استخراج هوشمند آدرس از کل کد امبد آپارات (حتی اگر با تگ <style> یا <div> شروع شده باشد)
    if (finalVideoUrl.includes("<iframe") || finalVideoUrl.includes("aparat.com")) {
      // جستجوی عبارت src="..." در کل متن ورودی
      const match = finalVideoUrl.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        finalVideoUrl = match[1]; // استخراج لینک تمیز: https://www.aparat.com/video/video/embed/...
      }
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("duration", duration.trim());
    formData.append("videoUrl", finalVideoUrl); // ارسال لینک خالص استخراج شده به بک‌اند

    const success = await onAddCourse(formData);
    setLoading(false);

    if (success) {
      setName("");
      setDescription("");
      setDuration("");
      setVideoUrl("");
    }
  };

  return (
    <div className="mb-8 pb-8 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
          <Plus className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black text-gray-800">افزودن دوره آموزشی جدید</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">نام دوره</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="مثال: آموزش پیشرفته هوش مصنوعی" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">انتخاب گروه آموزشی</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => onCategoryChange(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            >
              <option value="">یک گروه انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 mb-2">مدت زمان دوره</label>
            <div className="relative">
              <Clock className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                placeholder="مثال: 12 ساعت" 
                className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
              />
            </div>
          </div>

          {/* Video URL (تغییر تایپ به text برای پذیرش کدهای امبد بدون ارور مرورگر) */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 mb-2">کد امبد یا لینک ویدیو معرفی (آپارات)</label>
            <div className="relative">
              <Video className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" // ⚡️ تغییر از url به text
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
                placeholder="کد IFrame یا لینک مستقیم ویدیو را وارد کنید" 
                className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-left" 
                dir="ltr" 
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">توضیحات دوره</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={3} 
            placeholder="سرفصل‌ها و توضیحات مربوط به این دوره علمی..." 
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? "در حال ذخیره..." : "ایجاد و انتشار دوره"}
          </button>
        </div>
      </form>
    </div>
  );
}