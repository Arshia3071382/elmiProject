"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  FileJson,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  CheckCircle2,
  Code2,
} from "lucide-react";

interface Topic {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  description: string;
  startNodeId?: string;
  nodes?: Record<string, any>;
}

export default function AdminTopicsPanel() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // استیت‌های مودال فرم
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    startNodeId: "start",
    jsonContent: "", // دیتای متنی JSON درخت چت
  });
  const [jsonError, setJsonError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/chat/topics");
      const data = await res.json();
      if (data.success) {
        setTopics(data.data || []);
      }
    } catch (err) {
      console.error("خطا در دریافت تاپیک‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // الگوی پیش‌فرض JSON برای راحتی ادمین موقع ایجاد تاپیک جدید
  const defaultJsonTemplate = JSON.stringify(
    {
      start: {
        id: "start",
        text: "سلام! چطور می‌توانم راهنماییتان کنم؟",
        options: [{ label: "راهنمایی عمومی", nextNode: "general" }],
      },
      general: {
        id: "general",
        text: "این یک متن نمونه است.",
        options: [{ label: "بازگشت", nextNode: "start" }],
      },
    },
    null,
    2
  );

  const handleOpenCreateModal = () => {
    setEditingTopic(null);
    setJsonError("");
    setFormData({
      title: "",
      slug: "",
      description: "",
      startNodeId: "start",
      jsonContent: defaultJsonTemplate,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic: Topic) => {
    setEditingTopic(topic);
    setJsonError("");
    setFormData({
      title: topic.title || "",
      slug: topic.slug || "",
      description: topic.description || "",
      startNodeId: topic.startNodeId || "start",
      jsonContent: topic.nodes ? JSON.stringify(topic.nodes, null, 2) : "{}",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError("");

    // اعتبارسنجی فرمت JSON ورودی
    let parsedNodes = {};
    try {
      parsedNodes = JSON.parse(formData.jsonContent);
    } catch (err) {
      setJsonError("فرمت ساختار JSON معتبر نیست. لطفاً سینتکس آن را بررسی کنید.");
      return;
    }

    setIsSubmitting(true);
    const targetId = editingTopic?._id || editingTopic?.id;

    try {
      const url = editingTopic
        ? `/api/chat/topics/${targetId}`
        : "/api/chat/topics";
      const method = editingTopic ? "PUT" : "POST";

      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        startNodeId: formData.startNodeId,
        nodes: parsedNodes, // ذخیره مستقیم شیء درخت در مونگو
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        await fetchTopics();
        setIsModalOpen(false);
      } else {
        alert(result.message || "عملیات با خطا مواجه شد.");
      }
    } catch (err) {
      console.error("خطا در ارسال اطلاعات:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (topic: Topic) => {
    const targetId = topic._id || topic.id;
    if (!confirm("آیا از حذف این تاپیک مشاوره اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/chat/topics/${targetId}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setTopics((prev) => prev.filter((t) => (t._id || t.id) !== targetId));
      } else {
        alert(result.message || "حذف تاپیک انجام نشد.");
      }
    } catch (err) {
      console.error("خطا در حذف تاپیک:", err);
    }
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm" dir="rtl">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin ml-2" />
        <span className="text-sm font-medium text-gray-600">در حال دریافت لیست تاپیک‌ها...</span>
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-['iranSans-r'] space-y-6">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">مدیریت دپارتمان‌های مشاوره (MongoDB)</h2>
            <p className="text-xs text-gray-500">مدیریت سناریوها و درخت چت ذخیره‌شده در دیتابیس</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 shadow-sm shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
          <span>ایجاد تاپیک جدید</span>
        </button>
      </div>

      {/* جستجو */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجوی عنوان یا اسلاگ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <span className="text-xs text-gray-500">
          تعداد کل: <strong className="text-gray-800">{filteredTopics.length}</strong> دپارتمان
        </span>
      </div>

      {/* لیست کارت‌ها */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-xs text-gray-500">هیچ تاپیکی یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const nodeCount = topic.nodes ? Object.keys(topic.nodes).length : 0;
            return (
              <div
                key={topic._id || topic.id}
                className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-indigo-100 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{topic.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{topic.description}</p>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-mono font-medium dir-ltr shrink-0">
                      {topic.slug}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <FileJson className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{nodeCount} گره چت (در دیتابیس)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(topic)}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition"
                      title="ویرایش"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* راهنما */}
      <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100/80 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-900 leading-relaxed">
          تمام داده‌ها و ساختار درخت گفتگوی این دپارتمان‌ها مستقیماً در دیتابیس MongoDB ذخیره و ویرایش می‌شوند و وابسته به فایل‌های محلی نیستند.
        </p>
      </div>

      {/* مودال ایجاد/ویرایش */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">
                {editingTopic ? "ویرایش دپارتمان و درخت چت" : "افزودن دپارتمان جدید"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">عنوان دپارتمان</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: کنکور تجربی"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">اسلاگ (شناسه یکتا)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: experimental"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono text-left dir-ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">توضیحات کوتاه</label>
                <textarea
                  rows={2}
                  placeholder="توضیحات مربوط به این شاخه مشاوره..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">شناسه گره شروع چت (startNodeId)</label>
                <input
                  type="text"
                  required
                  placeholder="start"
                  value={formData.startNodeId}
                  onChange={(e) => setFormData({ ...formData, startNodeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono text-left dir-ltr"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-700 font-medium flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ساختار درخت گفتگوی JSON (ذخیره در دیتابیس)</span>
                  </label>
                </div>
                <textarea
                  rows={10}
                  required
                  value={formData.jsonContent}
                  onChange={(e) => setFormData({ ...formData, jsonContent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono text-left dir-ltr text-xs bg-gray-900 text-emerald-400 leading-relaxed"
                />
                {jsonError && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{jsonError}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingTopic ? "ذخیره تغییرات" : "ایجاد تاپیک"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}