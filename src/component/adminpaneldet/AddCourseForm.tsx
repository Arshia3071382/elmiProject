"use client";

import React, { useState } from "react";
import { Plus, Clock, Video, User, X, Check } from "lucide-react";

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

  // ۱. مدیریت لیست اساتید دیتابیس/داخلی فرانت‌اند
  const [teachersList, setTeachersList] = useState<string[]>([
    "آقای مختاری",
    "آقای گودرزی",
    "آقای خانجانی",
  ]);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [showAddTeacherInput, setShowAddTeacherInput] = useState(false);

  // ۲. مدیریت اساتید انتخاب شده برای دوره (تا حداکثر ۳ نفر)
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // افزودن استاد جدید به کل لیست کشویی
  const handleAddNewTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newTeacherName.trim();
    if (cleanName && !teachersList.includes(cleanName)) {
      setTeachersList([...teachersList, cleanName]);
      setNewTeacherName("");
      setShowAddTeacherInput(false);
    }
  };

  // انتخاب یا لغو انتخاب استاد در منوی کشویی
  const toggleTeacherSelection = (teacherName: string) => {
    if (selectedTeachers.includes(teacherName)) {
      setSelectedTeachers(selectedTeachers.filter((t) => t !== teacherName));
    } else {
      if (selectedTeachers.length < 3) {
        setSelectedTeachers([...selectedTeachers, teacherName]);
      } else {
        alert("برای هر دوره حداکثر می‌توانید ۳ استاد انتخاب کنید.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedCategory) return;

    setLoading(true);

    let finalVideoUrl = videoUrl.trim();
    if (finalVideoUrl.includes("<iframe") || finalVideoUrl.includes("aparat.com")) {
      const match = finalVideoUrl.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        finalVideoUrl = match[1];
      }
    }

    // ادغام نام اساتید انتخاب شده با کاما برای ارسال به دیتابیس
    const finalTeachers = selectedTeachers.join(" - ");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("teacher", finalTeachers || "بدون استاد"); 
    formData.append("description", description.trim());
    formData.append("duration", duration.trim());
    formData.append("videoUrl", finalVideoUrl);

    const success = await onAddCourse(formData);
    setLoading(false);

    if (success) {
      setName("");
      setSelectedTeachers([]);
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
        {/* ردیف اول: نام دوره، انتخاب گروه و مدیریت اساتید */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Custom Multiple Teacher Dropdown */}
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500">اساتید دوره (حداکثر ۳ نفر)</label>
              <button
                type="button"
                onClick={() => setShowAddTeacherInput(!showAddTeacherInput)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> تعریف استاد جدید
              </button>
            </div>

            {/* بخش پاپ‌آپ افزودن استاد جدید */}
            {showAddTeacherInput && (
              <div className="absolute z-30 bottom-full mb-2 left-0 right-0 bg-white p-3 rounded-xl border border-gray-200 shadow-xl space-y-2">
                <p className="text-xs font-bold text-gray-600">افزودن استاد جدید به سیستم:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="نام استاد جدید..."
                    className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewTeacher}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 font-bold"
                  >
                    اضافه کردن
                  </button>
                </div>
              </div>
            )}

            {/* باکس کشویی اساتید */}
            <div className="relative">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full min-h-[46px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 cursor-pointer flex flex-wrap gap-1.5 items-center justify-between"
              >
                {selectedTeachers.length === 0 ? (
                  <span className="text-gray-400">انتخاب اساتید...</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedTeachers.map((teacher) => (
                      <span 
                        key={teacher} 
                        className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        {teacher}
                        <X 
                          className="w-3 h-3 hover:text-red-500" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTeacherSelection(teacher);
                          }} 
                        />
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-gray-400 text-xs">▼</span>
              </div>

              {/* گزینه‌های منوی کشویی */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {teachersList.map((t) => {
                      const isSelected = selectedTeachers.includes(t);
                      return (
                        <div
                          key={t}
                          onClick={() => toggleTeacherSelection(t)}
                          className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer text-gray-700 transition"
                        >
                          <span>{t}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
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

          {/* Video URL */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 mb-2">کد امبد یا لینک ویدیو معرفی (آپارات)</label>
            <div className="relative">
              <Video className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
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