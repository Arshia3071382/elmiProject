"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Clock,
  User,
  Archive,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export interface ChecklistItem {
  id: string;
  category: "سرگروه" | "دانش‌آموز" | "دبیر" | "فضای آموزشی";
  studentName?: string;
  title: string;
  priority: "مطلوب" | "کم اهمیت" | "مهم" | "خیلی مهم";
  createdAt: string;
  resolved: boolean;
}

const CHECKLIST_SUGGESTIONS: Record<string, string[]> = {
  سرگروه: [
    "عدم حضور در کلاس درسی",
    "تاخیر در ورود به کلاس",
    "عدم کنترل نظم کلاس",
  ],
  دانش‌آموز: [
    "ناتوانی در درک مفاهیم درسی",
    "بی نظمی و بی دقتی",
    "پیشرفت فوق العاده در مباحث درسی",
    "استعداد درسی",
  ],
  دبیر: [
    "عدم بیان شیوا و ارائه نامطلوب",
    "ارتباط گیری ضعیف با دانش آموز",
    "عدم کنترل کلاس",
    "عدم به کارگیری دانش آموز در روند درسی",
  ],
  "فضای آموزشی": [
    "دمای نامطلوب محیط آموزشی",
    "صندلی و نیمکت آسیب دیده",
    "وضعیت نامناسب تخته آموزشی",
    "جمعیت بالای کلاس و کمبود صندلی",
  ],
};

interface ChecklistManagementPanelProps {
  onShowMessage: (type: "success" | "error", text: string) => void;
  username: string; // دریافت نام کاربری معین
}

export default function ChecklistManagementPanel({
  onShowMessage,
  username,
}: ChecklistManagementPanelProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"create" | "archive">("create");

  const [category, setCategory] = useState<"سرگروه" | "دانش‌آموز" | "دبیر" | "فضای آموزشی">("سرگروه");
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"مطلوب" | "کم اهمیت" | "مهم" | "خیلی مهم">("مهم");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [localMessage, setLocalMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showLocalMessage = (type: "success" | "error", text: string) => {
    setLocalMessage({ type, text });
    onShowMessage(type, text);
    setTimeout(() => setLocalMessage(null), 4000);
  };

  // ساخت کلید منحصر به فرد برای هر معین در localStorage
  const storageKey = `admin_checklists_v2_${username}`;

  useEffect(() => {
    if (!username) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setItems([]); // اگر معین جدیدی بود، لیست خالی باشد
    }
  }, [username, storageKey]);

  const saveItems = (updated: ChecklistItem[]) => {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showLocalMessage("error", "لطفاً نکته یا عنوان چک‌لیست را وارد کنید.");
      return;
    }
    if (category === "دانش‌آموز" && !studentName.trim()) {
      showLocalMessage("error", "لطفاً نام دانش‌آموز را وارد کنید.");
      return;
    }

    const now = new Date();
    const dateStr = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      category,
      studentName: category === "دانش‌آموز" ? studentName.trim() : undefined,
      title: title.trim(),
      priority,
      createdAt: dateStr,
      resolved: false,
    };

    saveItems([newItem, ...items]);
    setTitle("");
    setStudentName("");
    showLocalMessage("success", "چک‌لیست با موفقیت ثبت و به بایگانی اضافه شد.");
    setActiveSubTab("archive");
  };

  const handleToggleResolve = (id: string) => {
    const target = items.find((i) => i.id === id);
    const willBeResolved = target ? !target.resolved : false;

    const updated = items.map((item) =>
      item.id === id ? { ...item, resolved: willBeResolved } : item
    );
    saveItems(updated);

    if (willBeResolved) {
      showLocalMessage("success", "مورد به عنوان «رسیدگی‌شده» علامت‌گذاری شد.");
    } else {
      showLocalMessage("success", "وضعیت مورد به حالت عادی بازگردانده شد.");
    }
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
    showLocalMessage("success", "مورد از لیست حذف شد.");
  };

  const getPriorityBadgeStyle = (p: string) => {
    switch (p) {
      case "مطلوب":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "کم اهمیت":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "مهم":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "خیلی مهم":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getCardBorderStyle = (p: string, resolved: boolean) => {
    if (resolved) return "bg-slate-100/70 border-slate-200 opacity-60";
    switch (p) {
      case "مطلوب":
        return "bg-emerald-50/30 border-emerald-300 shadow-emerald-500/5";
      case "کم اهمیت":
        return "bg-amber-50/30 border-amber-300 shadow-amber-500/5";
      case "مهم":
        return "bg-orange-50/30 border-orange-300 shadow-orange-500/5";
      case "خیلی مهم":
        return "bg-rose-50/30 border-rose-300 shadow-rose-500/5";
      default:
        return "bg-white border-slate-200";
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        filterCategory === "all" || item.category === filterCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.studentName &&
          item.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.createdAt.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [items, filterCategory, searchQuery]);

  return (
    <div className="space-y-6 relative pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-800">
            مدیریت چک‌لیست‌های اختصاصی ({username})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ثبت و پیگیری نکات کلاس مخصوص حساب کاربری شما.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveSubTab("create")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "create"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ثبت نکته جدید
          </button>
          <button
            onClick={() => setActiveSubTab("archive")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "archive"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            بایگانی من ({items.length})
          </button>
        </div>
      </div>

      {activeSubTab === "create" ? (
        <form
          onSubmit={handleCreate}
          className="space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ۱. انتخاب دسته‌بندی موضوعی
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["سرگروه", "دانش‌آموز", "دبیر", "فضای آموزشی"] as const).map(
                (cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setTitle("");
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      category === cat
                        ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {category === "دانش‌آموز" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نام دانش‌آموز
              </label>
              <div className="relative">
                <User className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="نام و نام خانوادگی دانش‌آموز..."
                  className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ۲. شرح نکته یا انتخاب از پیشنهادات سریع
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {CHECKLIST_SUGGESTIONS[category]?.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => setTitle(suggestion)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                    title === suggestion
                      ? "bg-teal-50 text-teal-700 border-teal-300"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="یا نکته مد نظر خود را اینجا تایپ کنید..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ۳. سطح رسیدگی و اهمیت
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  {
                    label: "مطلوب",
                    color:
                      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                  },
                  {
                    label: "کم اهمیت",
                    color:
                      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
                  },
                  {
                    label: "مهم",
                    color:
                      "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
                  },
                  {
                    label: "خیلی مهم",
                    color:
                      "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                  },
                ] as const
              ).map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setPriority(p.label as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                    p.color
                  } ${
                    priority === p.label
                      ? "ring-2 ring-slate-800 ring-offset-1 font-black"
                      : "opacity-80"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت نهایی و انتقال به بایگانی</span>
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عنوان، نام دانش‌آموز یا تاریخ..."
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              {[
                { id: "all", label: "همه دسته ها" },
                { id: "سرگروه", label: "سرگروه" },
                { id: "دانش‌آموز", label: "دانش‌آموز" },
                { id: "دبیر", label: "دبیر" },
                { id: "فضای آموزشی", label: "فضای آموزشی" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterCategory(f.id)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    filterCategory === f.id
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Archive className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">
                  هیچ موردی در بایگانی شما یافت نشد
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  می‌توانید از تب «ثبت نکته جدید»، مورد جدید اضافه کنید.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${getCardBorderStyle(
                    item.priority,
                    item.resolved
                  )}`}
                >
                  {item.resolved && (
                    <div className="absolute left-4 top-4 md:static flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-black text-xs shadow-inner">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>انجام شده</span>
                    </div>
                  )}

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-white/80 border border-slate-200/80 rounded-lg text-[10px] font-black text-slate-700">
                        {item.category}
                      </span>
                      {item.studentName && (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-200">
                          دانش‌آموز: {item.studentName}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getPriorityBadgeStyle(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p
                      className={`text-xs font-bold leading-relaxed ${
                        item.resolved
                          ? "line-through text-slate-500"
                          : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>تاریخ ثبت: {item.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => handleToggleResolve(item.id)}
                      className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        item.resolved
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>رسیدگی شد</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="حذف کامل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* پیام موفقیت/خطا شناور در پایین سمت راست */}
      {localMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold shadow-xl border backdrop-blur-md ${
              localMessage.type === "success"
                ? "bg-emerald-600/95 text-white border-emerald-500 shadow-emerald-500/20"
                : "bg-rose-600/95 text-white border-rose-500 shadow-rose-500/20"
            }`}
          >
            {localMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
            )}
            <span>{localMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}