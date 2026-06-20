"use client";

import { useState } from "react";
import { Plus, Upload, X, Video, FileText, Clock } from "lucide-react";

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
  coursesCount,
}: AddCourseFormProps) {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "video/mp4") {
        alert("فقط فایل‌های MP4 پشتیبانی می‌شوند");
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        alert("حجم ویدیو نباید بیشتر از 500 مگابایت باشد");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      alert("لطفاً نام دوره را وارد کنید");
      return;
    }
    if (!selectedCategory) {
      alert("لطفاً یک گروه انتخاب کنید");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", courseName.trim());
    formData.append("categoryId", selectedCategory);
    formData.append("description", description.trim());
    formData.append("duration", duration.trim());
    if (videoFile) {
      formData.append("video", videoFile);
    }

    const success = await onAddCourse(formData);
    
    if (success) {
      setCourseName("");
      setDescription("");
      setDuration("");
      setVideoFile(null);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        افزودen دوره جدید
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام دوره <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: آموزش React پیشرفته"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              گروه دوره <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">انتخاب گروه...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({coursesCount(cat._id)} دوره)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline ml-1" />
            توضیحات دوره
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="توضیحات کامل دوره..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline ml-1" />
              مدت زمان دوره
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: 10 ساعت و 30 دقیقه"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Video className="w-4 h-4 inline ml-1" />
              ویدیوی آموزشی
            </label>
            <div className="relative">
              <input
                type="file"
                name="video"
                accept="video/mp4"
                onChange={handleVideoSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
              >
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {videoFile ? videoFile.name : "انتخاب فایل ویدیو (MP4)"}
                </span>
              </label>
              {videoFile && (
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    if (videoPreview) URL.revokeObjectURL(videoPreview);
                    setVideoPreview(null);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {videoPreview && (
          <div className="mt-2">
            <video
              src={videoPreview}
              controls
              className="w-full max-h-48 rounded-lg"
              preload="metadata"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "در حال افزودن..." : "افزودن دوره"}
        </button>
      </form>
    </div>
  );
}