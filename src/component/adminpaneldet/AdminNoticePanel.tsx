"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  CircleCheck,
  CircleX,
  Pencil,
  Image as ImageIcon,
  X,
  Calendar,
  LayoutTemplate,
  Trash2,
  Edit3,
  AlertTriangle,
} from "lucide-react";

interface AdminNoticePanelProps {
  onShowMessage?: (type: "success" | "error", text: string) => void;
  onClose?: () => void;
}

const typeOptions = [
  { value: "news", label: "خبر", icon: Newspaper, bgColor: "bg-blue-50", borderColor: "border-blue-500", textColor: "text-blue-600" },
  { value: "schedule", label: "برگزاری کلاس", icon: CircleCheck, bgColor: "bg-green-50", borderColor: "border-green-500", textColor: "text-green-600" },
  { value: "cancel", label: "کنسلی کلاس", icon: CircleX, bgColor: "bg-red-50", borderColor: "border-red-500", textColor: "text-red-600" },
  { value: "correction", label: "اصلاحیه", icon: Pencil, bgColor: "bg-yellow-50", borderColor: "border-yellow-500", textColor: "text-yellow-600" },
];

export default function AdminNoticePanel({ onShowMessage, onClose }: AdminNoticePanelProps) {
  const router = useRouter();
  const [notices, setNotices] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"news" | "schedule" | "cancel" | "correction">("news");
  const [image, setImage] = useState("");
  const [imageLayout, setImageLayout] = useState<"vertical" | "horizontal">("vertical");
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // استیت‌های مربوط به مودال حذف
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error("Error fetching notices", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage("");
    setImageLayout("vertical");
    setEventDate("");
    setType("news");
    setEditingId(null);
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
      const url = editingId ? `/api/notices?id=${editingId}` : "/api/notices";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image: image.trim() ? image.trim() : null,
          imageLayout,
          type,
          eventDate: eventDate.trim() ? eventDate.trim() : null,
        }),
      });

      if (response.ok) {
        const successMsg = editingId ? "اعلان با موفقیت ویرایش شد" : "اعلان با موفقیت ثبت شد";
        if (onShowMessage) onShowMessage("success", successMsg);
        resetForm();
        fetchNotices();
        router.refresh();
      } else {
        const data = await response.json();
        const errorMsg = data.error || "خطا در عملیات";
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

  const handleEditClick = (notice: any) => {
    setEditingId(notice._id);
    setTitle(notice.title);
    setContent(notice.content);
    setType(notice.type);
    setImage(notice.image || "");
    setImageLayout(notice.imageLayout || "vertical");
    setEventDate(notice.eventDate || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // باز کردن مودال تایید حذف
  const openDeleteModal = (id: string, noticeTitle: string) => {
    setNoticeToDelete({ id, title: noticeTitle });
    setDeleteModalOpen(true);
  };

  // اجرای عملیات حذف پس از تایید در مودال
  const confirmDelete = async () => {
    if (!noticeToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/notices?id=${noticeToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onShowMessage) onShowMessage("success", "اعلان با موفقیت حذف شد");
        fetchNotices();
        router.refresh();
      } else {
        if (onShowMessage) onShowMessage("error", "خطا در حذف اعلان");
      }
    } catch (err) {
      if (onShowMessage) onShowMessage("error", "خطا در ارتباط با سرور");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setNoticeToDelete(null);
    }
  };

  const selectedType = typeOptions.find((t) => t.value === type);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 relative">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="font-bold text-gray-800 text-base" style={{ fontFamily: "iranBold" }}>
            {editingId ? "✏️ ویرایش اعلان" : "📌 ایجاد اعلان جدید"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-red-600 hover:underline"
              style={{ fontFamily: "iranSans-r" }}
            >
              لغو ویرایش و ایجاد جدید
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700" style={{ fontFamily: "iranSans-r" }}>عنوان اعلان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
            placeholder="عنوان اعلان را وارد کنید..."
            maxLength={100}
            required
            style={{ fontFamily: "iranSans-r" }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700" style={{ fontFamily: "iranSans-r" }}>متن اعلان</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none"
            placeholder="متن اعلان را وارد کنید..."
            maxLength={500}
            required
            style={{ fontFamily: "iranSans-r" }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700" style={{ fontFamily: "iranSans-r" }}>نوع اعلان</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-gray-900 focus:outline-none ${selectedType?.borderColor} ${selectedType?.bgColor} ${selectedType?.textColor}`}
            style={{ fontFamily: "iranBold" }}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 flex items-center gap-1.5" style={{ fontFamily: "iranSans-r" }}>
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>تاریخ رویداد / برگزاری (اختیاری)</span>
          </label>
          <input
            type="text"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            placeholder="مثال: ۱۴۰۵/۰۶/۱۸ یا شنبه ۱۸ شهریور"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none text-left dir-ltr"
            style={{ fontFamily: "iranSans-r" }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 flex items-center gap-1.5" style={{ fontFamily: "iranSans-r" }}>
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span>لینک مستقیم تصویر یا پوستر (اختیاری)</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none text-left dir-ltr"
            />
            {image && (
              <button
                type="button"
                onClick={() => setImage("")}
                className="rounded-lg bg-red-50 px-3 text-red-600 hover:bg-red-100 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {image && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1" style={{ fontFamily: "iranBold" }}>
                <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
                <span>حالت نمایش تصویر در اعلان:</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setImageLayout("vertical")}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    imageLayout === "vertical"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "iranBold" }}
                >
                  پوستر عمودی (کارت‌مانند)
                </button>
                <button
                  type="button"
                  onClick={() => setImageLayout("horizontal")}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    imageLayout === "horizontal"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "iranBold" }}
                >
                  تصویر افقی (بنر عریض)
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200" style={{ fontFamily: "iranSans-r" }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
            style={{ fontFamily: "iranBold" }}
          >
            {loading ? "در حال پردازش..." : editingId ? "ذخیره تغییرات" : "ثبت اعلان"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              style={{ fontFamily: "iranSans-r" }}
            >
              بستن
            </button>
          )}
        </div>
      </form>

      {/* List of Existing Notices */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-800 text-sm" style={{ fontFamily: "iranBold" }}>لیست اعلان‌های ثبت‌شده ({notices.length})</h4>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {notices.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6" style={{ fontFamily: "iranSans-r" }}>هیچ اعلانی ثبت نشده است.</p>
          ) : (
            notices.map((n) => (
              <div key={n._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/60 transition-colors">
                <div className="min-w-0 flex-1 ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold" style={{ fontFamily: "iranBold" }}>
                      {n.type}
                    </span>
                    <h5 className="text-xs font-bold text-gray-800 truncate" style={{ fontFamily: "iranBold" }}>{n.title}</h5>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate" style={{ fontFamily: "iranSans-r" }}>{n.content}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(n)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(n._id, n.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* مودال حرفه‌ای و انیمیشنی تأیید حذف */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => !deleteLoading && setDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* آیکون هشدار */}
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>

              {/* متن‌ها */}
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-gray-900" style={{ fontFamily: "iranBold" }}>
                  حذف اعلان
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: "iranSans-r" }}>
                  آیا از حذف اعلان <span className="font-bold text-gray-800">«{noticeToDelete?.title}»</span> اطمینان دارید؟ این عمل غیرقابل بازگشت است.
                </p>
              </div>

              {/* دکمه‌های اقدام */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ fontFamily: "iranBold" }}
                >
                  انصراف
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-md shadow-red-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "iranBold" }}
                >
                  {deleteLoading ? (
                    <span>در حال حذف...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>بله، حذف شود</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}