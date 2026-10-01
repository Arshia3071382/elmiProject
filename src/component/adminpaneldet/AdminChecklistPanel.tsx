'use client';

import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  _id: string;
  category: 'سرگروه' | 'دانش‌آموز' | 'دبیر' | 'فضای آموزشی';
  studentName?: string;
  itemText: string;
  priority: 'مطلوب' | 'کم‌‌اهمیت' | 'مهم' | 'خیلی مهم';
  persianDate: string;
  isCompleted: boolean;
  createdAt: string;
}

const predefinedOptions: Record<string, string[]> = {
  'سرگروه': [
    'عدم حضور در کلاس درسی',
    'تاخیر در ورود به کلاس',
    'عدم کنترل نظم کلاس'
  ],
  'دانش‌آموز': [
    'ناتوانی در درک مفاهیم درسی',
    'بی نظمی و بی دقتی',
    'پیشرفت فوق‌العاده در مباحث درسی',
    'استعداد درسی'
  ],
  'دبیر': [
    'عدم بیان شیوا و ارائه نامطلوب',
    'ارتباط‌‌گیری ضعیف با دانش‌آموز',
    'عدم کنترل کلاس',
    'عدم به‌‌کارگیری دانش‌آموز در روند درسی'
  ],
  'فضای آموزشی': [
    'دمای نامطلوب محیط آموزشی',
    'صندلی و نیمکت آسیب‌دیده',
    'وضعیت نامناسب تخته آموزشی',
    'جمعیت بالای کلاس و کمبود صندلی'
  ]
};

const priorityColors: Record<string, string> = {
  'مطلوب': 'bg-emerald-50 border-emerald-300 text-emerald-800',
  'کم‌اهمیت': 'bg-amber-50 border-amber-300 text-amber-800',
  'مهم': 'bg-orange-50 border-orange-300 text-orange-800',
  'خیلی مهم': 'bg-rose-50 border-rose-300 text-rose-800',
};

const badgeColors: Record<string, string> = {
  'مطلوب': 'bg-emerald-500 text-white',
  'کم‌اهمیت': 'bg-amber-500 text-white',
  'مهم': 'bg-orange-500 text-white',
  'خیلی مهم': 'bg-rose-600 text-white',
};

export default function AdminChecklistPanel() {
  const [activeTab, setActiveTab] = useState<'create' | 'archive'>('create');
  const [category, setCategory] = useState<'سرگروه' | 'دانش‌آموز' | 'دبیر' | 'فضای آموزشی'>('سرگروه');
  const [studentName, setStudentName] = useState('');
  const [itemText, setItemText] = useState('');
  const [priority, setPriority] = useState<'مطلوب' | 'کم‌اهمیت' | 'مهم' | 'خیلی مهم'>('مهم');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // بایگانی و فیلترها
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('همه');
  const [fetching, setFetching] = useState(false);

  // تولید تاریخ شمسی جاری
  const getPersianDate = () => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  };

  const fetchChecklists = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/admin/checklists');
      const data = await res.json();
      if (data.success) {
        setChecklists(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemText.trim()) {
      setMessage('لطفاً متن چک‌لیست را وارد یا انتخاب کنید.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const persianDate = getPersianDate();

      const res = await fetch('/api/admin/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          studentName: category === 'دانش‌آموز' ? studentName : '',
          itemText,
          priority,
          persianDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('چک‌لیست با موفقیت ثبت شد!');
        setItemText('');
        setStudentName('');
        fetchChecklists();
      } else {
        setMessage(data.message || 'خطا در ثبت چک‌لیست.');
      }
    } catch (err) {
      setMessage('خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/checklists', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setChecklists(prev =>
          prev.map(item => (item._id === id ? { ...item, isCompleted: !currentStatus } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChecklists = checklists.filter(item => {
    const matchesCategory = filterCategory === 'همه' || item.category === filterCategory;
    const matchesSearch =
      item.itemText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.studentName && item.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.persianDate.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans" dir="rtl">
      {/* هدر و تب‌ها */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800">چک‌لیست هوشمند معین‌های علمی</h1>
          <p className="text-sm text-slate-500 mt-1">ثبت سریع نکات کلاس و پیگیری وضعیت عملکردی در بخش‌های مختلف</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'create' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ثبت چک‌لیست جدید
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'archive' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بایگانی و پیگیری ({checklists.filter(c => !c.isCompleted).length})
          </button>
        </div>
      </div>

      {/* تب اول: ثبت چک‌لیست */}
      {activeTab === 'create' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* انتخاب دسته */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">انتخاب دسته‌بندی موضوعی</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['سرگروه', 'دانش‌آموز', 'دبیر', 'فضای آموزشی'] as const).map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setItemText('');
                    }}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                      category === cat
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* نام دانش‌آموز (فقط برای دسته دانش‌آموز) */}
            {category === 'دانش‌آموز' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نام و نام خانوادگی دانش‌آموز</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  required
                />
              </div>
            )}

            {/* پیشنهادهای سرعتی */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">گزینه‌های پیشنهادی سریع (یا تایپ آزاد پایین‌تر)</label>
              <div className="flex flex-wrap gap-2">
                {predefinedOptions[category]?.map((opt, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setItemText(opt)}
                    className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                      itemText === opt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* متن چک‌لیست (تایپ آزاد یا انتخاب شده) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">شرح نکته یا مشاهده در کلاس</label>
              <textarea
                rows={3}
                value={itemText}
                onChange={e => setItemText(e.target.value)}
                placeholder="می‌توانید از گزینه‌های بالا انتخاب کنید یا خودتان یادداشت کنید..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                required
              />
            </div>

            {/* سطح رسیدگی */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">سطح رسیدگی و اهمیت</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['مطلوب', 'کم‌اهمیت', 'مهم', 'خیلی مهم'] as const).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                      priority === p ? badgeColors[p] + ' ring-2 ring-offset-2 ring-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('موفقیت') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? 'در حال ثبت...' : 'ثبت و ارسال چک‌لیست'}
            </button>
          </form>
        </div>
      )}

      {/* تب دوم: بایگانی و پیگیری */}
      {activeTab === 'archive' && (
        <div className="space-y-6">
          {/* فیلترها و جستجو */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="جستجو در متن، نام دانش‌آموز یا تاریخ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full md:w-96 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['همه', 'سرگروه', 'دانش‌آموز', 'دبیر', 'فضای آموزشی'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* لیست کارت‌ها */}
          {fetching ? (
            <div className="text-center py-12 text-slate-400 font-medium">در حال بارگذاری بایگانی...</div>
          ) : filteredChecklists.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
              موردی در بایگانی یافت نشد.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChecklists.map(item => (
                <div
                  key={item._id}
                  className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    priorityColors[item.priority]
                  } ${item.isCompleted ? 'opacity-50 bg-slate-100 border-slate-300' : 'shadow-sm'}`}
                >
                  {/* تیک سبز بزرگ در صورت رسیدگی */}
                  {item.isCompleted && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-lg font-black text-base animate-bounce">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        رسیدگی شد
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-white/80 shadow-xs">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold opacity-75">{item.persianDate}</span>
                    </div>

                    {item.studentName && (
                      <div className="mb-2 text-sm font-bold bg-white/60 px-3 py-1 rounded-lg inline-block">
                        دانش‌آموز: {item.studentName}
                      </div>
                    )}

                    <p className="text-sm font-medium leading-relaxed mb-4">{item.itemText}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-black/5 mt-auto">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/70">
                      اهمیت: {item.priority}
                    </span>
                    <button
                      onClick={() => handleToggleComplete(item._id, item.isCompleted)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        item.isCompleted
                          ? 'bg-slate-700 text-white hover:bg-slate-800'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {item.isCompleted ? 'لغو رسیدگی' : 'رسیدگی شد'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}