"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  CircleCheck,
  CircleX,
  Pencil,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface AdminNoticePanelProps {
  onShowMessage?: (type: "success" | "error", text: string) => void;
  onClose?: () => void;
}

const typeOptions = [
  {
    value: "news",
    label: "خبر",
    icon: Newspaper,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-600",
    hoverBg: "hover:bg-blue-100",
  },
  {
    value: "schedule",
    label: "برگزاری کلاس",
    icon: CircleCheck,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-600",
    hoverBg: "hover:bg-green-100",
  },
  {
    value: "cancel",
    label: "کنسلی کلاس",
    icon: CircleX,
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-600",
    hoverBg: "hover:bg-red-100",
  },
  {
    value: "correction",
    label: "اصلاحیه",
    icon: Pencil,
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-600",
    hoverBg: "hover:bg-yellow-100",
  },
];

export default function AdminNoticePanel({
  onShowMessage,
  onClose,
}: AdminNoticePanelProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<
    "news" | "schedule" | "cancel" | "correction"
  >("news");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      const errorMsg = "لطفاً عنوان و متن اعلان را وارد کنید";
      setError(errorMsg);
      if (onShowMessage) onShowMessage("error", errorMsg);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image,
          type,
        }),
      });

      if (response.ok) {
        const successMsg = "اعلان با موفقیت ثبت شد";
        if (onShowMessage) onShowMessage("success", successMsg);
        setTitle("");
        setContent("");
        setImage(null);
        setType("news");
        router.refresh();
        if (onClose) onClose();
      } else {
        const data = await response.json();
        const errorMsg = data.error || "خطا در ثبت اعلان";
        setError(errorMsg);
        if (onShowMessage) onShowMessage("error", errorMsg);
      }
    } catch (error) {
      const errorMsg = "خطا در ارتباط با سرور";
      setError(errorMsg);
      if (onShowMessage) onShowMessage("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = typeOptions.find((t) => t.value === type);

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            عنوان اعلان
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            placeholder="عنوان اعلان را وارد کنید..."
            maxLength={100}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            متن اعلان
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            placeholder="متن اعلان را وارد کنید..."
            maxLength={500}
            required
          />
        </div>

        {/* Notice Type - Select */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            نوع اعلان
          </label>
          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as "news" | "schedule" | "cancel" | "correction",
              )
            }
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              selectedType?.borderColor
            } ${selectedType?.bgColor} ${selectedType?.textColor}`}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value} className="py-2">
                {option.label}
              </option>
            ))}
          </select>
          {selectedType && (
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedType.bgColor} ${selectedType.textColor}`}
              >
                <selectedType.icon className="h-4 w-4" />
              </div>
              <span className={`text-sm font-medium ${selectedType.textColor}`}>
                نوع انتخاب شده: {selectedType.label}
              </span>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            تصویر (اختیاری)
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                <ImageIcon className="h-4 w-4" />
                انتخاب تصویر
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {image && (
              <button
                type="button"
                onClick={removeImage}
                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {image && (
            <div className="mt-3 relative h-32 w-48 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={image}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                در حال ثبت...
              </div>
            ) : (
              "ثبت اعلان"
            )}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              انصراف
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
