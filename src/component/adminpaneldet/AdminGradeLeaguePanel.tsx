"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Plus,
  UserPlus,
  CheckSquare,
  X,
  Save,
  Search,
  RefreshCw,
  ArrowRight,
  Award,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { LEAGUE_ACTIVITIES, calculateTotalScore } from "./../../../lib/leagueActivities";

const GRADES = [
  { id: 2, label: "پایه دوم" },
  { id: 3, label: "پایه سوم" },
  { id: 4, label: "پایه چهارم" },
  { id: 5, label: "پایه پنجم" },
  { id: 6, label: "پایه ششم" },
  { id: 7, label: "پایه هفتم" },
  { id: 8, label: "پایه هشتم" },
  { id: 9, label: "پایه نهم" },
];

export default function AdminGradeLeaguePanel() {
  // مدیریت مرحله نمایش: null یعنی صفحه انتخاب اولیه پایه | عدد یعنی صفحه جدول آن پایه
  const [activeGrade, setActiveGrade] = useState<number | null>(null);

  // فرم ثبت دانش‌آموز جدید
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // دیتای جدول دانش‌آموزان
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // مدیریت مودال امتیازات
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeCheckboxes, setActiveCheckboxes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchActivity, setSearchActivity] = useState("");

  const toPersianDigits = (n: number | string) => {
    return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  // بارگذاری لیست دانش‌آموزان پایه انتخاب‌شده
  const fetchStudents = useCallback(async () => {
    if (activeGrade === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${activeGrade}`).then((r) =>
        r.json()
      );
      if (Array.isArray(res)) setStudents(res);
    } catch (err) {
      console.error("خطا در دریافت لیست دانش‌آموزان:", err);
    } finally {
      setLoading(false);
    }
  }, [activeGrade]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ثبت دانش‌آموز جدید
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || activeGrade === null) return;

    setCreating(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, grade: activeGrade }),
      });
      if (res.ok) {
        setNewName("");
        fetchStudents();
      }
    } catch (err) {
      console.error("خطا در ایجاد دانش‌آموز:", err);
    } finally {
      setCreating(false);
    }
  };

  // باز کردن مودال و شروع با چک‌باکس‌های خالی جهت افزودن امتیاز جدید
  const handleOpenModal = (student: any) => {
    setSelectedStudent(student);
    setActiveCheckboxes([]); // ریست کردن چک‌باکس‌ها برای انتخاب جدید
    setSearchActivity("");
  };

  // سوئیچ تیک فعالیت
  const toggleActivity = (id: string) => {
    setActiveCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ذخیره‌سازی امتیازات به صورت تجمعی در دیتابیس
  const handleSaveActivities = async () => {
    if (!selectedStudent) return;
    setSaving(true);

    // محاسبه مجموع امتیاز فعالیت‌های انتخاب‌شده در این نوبت
    const addedScore = calculateTotalScore(activeCheckboxes);

    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedStudent._id,
          selectedActivities: activeCheckboxes, // فعالیت‌های جدید این مرحله
          addedScore: addedScore,                 // امتیاز برای جمع با امتیاز قبلی در سرور ($inc)
        }),
      });

      if (res.ok) {
        setActiveCheckboxes([]);  // ۱. ریست کردن گزینه‌ها برای نوبت بعدی
        setSelectedStudent(null);  // ۲. بستن مودال
        fetchStudents();           // ۳. به‌روزرسانی جدول
      }
    } catch (err) {
      console.error("خطا در ذخیره امتیازات:", err);
    } finally {
      setSaving(false);
    }
  };

  // دسته‌بندی فعالیت‌ها
  const groupedActivities = LEAGUE_ACTIVITIES.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof LEAGUE_ACTIVITIES>);

  const liveCalculatedScore = calculateTotalScore(activeCheckboxes);

  return (
    <div dir="rtl" className="w-full bg-slate-50 min-h-screen p-4 md:p-8 font-[IRANSansXFaNum-Bold] text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* =========================================================
            صفحه ۱: انتخاب اولیه پایه تحصیلی
           ========================================================= */}
        {activeGrade === null ? (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 border border-emerald-200 shadow-sm">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                مدیریت لیگ علمی پایه
              </h1>
              <p className="text-slate-500 text-sm font-[IRANSansXFaNum-Regular]">
                جهت ثبت دانش‌آموز جدید یا درج امتیازات، ابتدا پایه تحصیلی مورد نظر را انتخاب کنید:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {GRADES.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setActiveGrade(g.id)}
                  className="group cursor-pointer bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm">
                      {toPersianDigits(g.id)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {g.label}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-[IRANSansXFaNum-Regular]">
                        ورود به مدیریت
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:-translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* =========================================================
              صفحه ۲: جدول دانش‌آموزان و تعیین امتیاز پایه انتخاب‌شده
             ========================================================= */
          <div className="space-y-6">
            {/* دکمه بازگشت و هدر */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveGrade(null)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                  title="بازگشت به انتخاب پایه"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    مدیریت {GRADES.find((g) => g.id === activeGrade)?.label}
                  </h2>
                  <p className="text-xs text-slate-500 font-[IRANSansXFaNum-Regular] mt-0.5">
                    لیست دانش‌آموزان ثبت‌شده و محاسبه نمرات
                  </p>
                </div>
              </div>

              {/* سوئیچ سریع بین پایه‌ها */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGrade(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeGrade === g.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* فرم افزودن دانش‌آموز جدید */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>ثبت دانش‌آموز جدید</span>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
                      نام و نام خانوادگی:
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="مثال: محمدجواد ابراهیمی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                      required
                    />
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-[IRANSansXFaNum-Regular]">
                    ثبت هوشمند در:{" "}
                    <strong className="font-bold">
                      {GRADES.find((g) => g.id === activeGrade)?.label}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {creating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    افزودن دانش‌آموز
                  </button>
                </form>
              </div>

              {/* جدول دانش‌آموزان */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>
                      جدول رتبه‌بندی {GRADES.find((g) => g.id === activeGrade)?.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
                    تعداد: {toPersianDigits(students.length)} نفر
                  </span>
                </div>

                {loading ? (
                  <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                    <span className="text-xs font-[IRANSansXFaNum-Regular]">
                      در حال بارگذاری اطلاعات جدول...
                    </span>
                  </div>
                ) : students.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 font-[IRANSansXFaNum-Regular] text-sm">
                    هنوز دانش‌آموزی برای این پایه ثبت نشده است.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
                          <th className="py-3 px-3">رتبه</th>
                          <th className="py-3 px-3">نام و نام خانوادگی</th>
                          <th className="py-3 px-3 text-center">تعداد فعالیت</th>
                          <th className="py-3 px-3 text-center">امتیاز کل</th>
                          <th className="py-3 px-3 text-left">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map((st, idx) => (
                          <tr key={st._id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-500">
                              {toPersianDigits(idx + 1)}
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">{st.name}</td>
                            <td className="py-3 px-3 text-center text-xs text-slate-500 font-[IRANSansXFaNum-Regular]">
                              {toPersianDigits(st.selectedActivities?.length || 0)} مورد
                            </td>
                            <td className="py-3 px-3 text-center font-black text-emerald-600 text-base">
                              {toPersianDigits(st.totalScore.toLocaleString())}
                            </td>
                            <td className="py-3 px-3 text-left">
                              <button
                                onClick={() => handleOpenModal(st)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                                افزودن امتیاز
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          مودال تعیین و محاسبگر فعالیت‌های دانش‌آموز
         ========================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* هدر مودال */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    افزودن فعالیت و امتیاز جدید: {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
                    مقطع: {GRADES.find((g) => g.id === selectedStudent.grade)?.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* بخش جستجو و مجموع محاسبه‌شده لحظه‌ای این مرحله */}
            <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="جستجوی عنوان فعالیت..."
                  value={searchActivity}
                  onChange={(e) => setSearchActivity(e.target.value)}
                  className="w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-[IRANSansXFaNum-Regular] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-emerald-200 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs font-bold text-slate-600 font-[IRANSansXFaNum-Regular]">
                  امتیاز اضافه شونده این مرحله:
                </span>
                <span className="text-xl font-black text-emerald-600 font-mono">
                  {toPersianDigits(liveCalculatedScore)}
                </span>
              </div>
            </div>

            {/* لیست چک‌باکس‌ها در دسته‌بندی‌های دقیق */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {Object.entries(groupedActivities).map(([category, items]) => {
                const filteredItems = items.filter((i) =>
                  i.title.includes(searchActivity)
                );
                if (filteredItems.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-black text-emerald-800 bg-emerald-100/60 px-3 py-1.5 rounded-lg w-fit">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredItems.map((act) => {
                        const isChecked = activeCheckboxes.includes(act.id);
                        return (
                          <label
                            key={act.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleActivity(act.id)}
                                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                              />
                              <span className="font-[IRANSansXFaNum-Regular]">{act.title}</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                                act.score < 0
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {act.score > 0
                                ? `+${toPersianDigits(act.score)}`
                                : toPersianDigits(act.score)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* فوتر مودال */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors font-[IRANSansXFaNum-Regular]"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveActivities}
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                محاسبه و ذخیره نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}