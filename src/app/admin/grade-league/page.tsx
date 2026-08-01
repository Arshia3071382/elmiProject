"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, UserPlus, CheckSquare, X, Save, Search, RefreshCw, Award } from "lucide-react";
import { LEAGUE_ACTIVITIES, calculateTotalScore } from "./../../../../lib/leagueActivities";

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

export default function AdminGradeLeaguePage() {
  // فرم افزودن دانش‌آموز
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<number>(2);
  const [creating, setCreating] = useState(false);

  // لیست دانش‌آموزان
  const [adminGradeFilter, setAdminGradeFilter] = useState<number>(2);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // مودال امتیازدهی
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeCheckboxes, setActiveCheckboxes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchActivity, setSearchActivity] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${adminGradeFilter}`).then((r) =>
        r.json()
      );
      if (Array.isArray(res)) setStudents(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [adminGradeFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ایجاد دانش‌آموز جدید
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, grade: newGrade }),
      });
      if (res.ok) {
        setNewName("");
        if (newGrade === adminGradeFilter) {
          fetchStudents();
        } else {
          setAdminGradeFilter(newGrade);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // باز کردن مودال ویرایش
  const handleOpenModal = (student: any) => {
    setSelectedStudent(student);
    setActiveCheckboxes(student.selectedActivities || []);
  };

  // تیک زدن/برداشتن تیک
  const toggleActivity = (id: string) => {
    setActiveCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ذخیره‌سازی امتیازات دانش‌آموز
  const handleSaveActivities = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          selectedActivities: activeCheckboxes,
        }),
      });
      if (res.ok) {
        setSelectedStudent(null);
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // گروه‌بندی فعالیت‌ها براساس دسته
  const groupedActivities = LEAGUE_ACTIVITIES.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof LEAGUE_ACTIVITIES>);

  const liveCalculatedScore = calculateTotalScore(activeCheckboxes);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 font-[iranBold]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* هدر ادمین */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">مدیریت لیگ علمی پایه</h1>
            <p className="text-xs text-slate-500 font-[iranSans-r]">
              تعریف دانش‌آموز جدید و تیک زدن فعالیت‌های انجام‌شده برای محاسبه آنلاین امتیازات
            </p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-2xl border border-teal-200">
            <Award className="w-5 h-5" />
            <span className="text-sm font-bold">پنل ادمین ثبت نمرات</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* بخش ۱: ساخت دانش‌آموز جدید */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-fit">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
              <UserPlus className="w-5 h-5 text-teal-600" />
              <span>تعریف دانش‌آموز جدید</span>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 font-[iranSans-r]">
                  نام و نام خانوادگی:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: علی محمدی"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-[iranSans-r]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 font-[iranSans-r]">
                  پایه تحصیلی:
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-[iranSans-r]"
                >
                  {GRADES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                افزودن به لیگ
              </button>
            </form>
          </div>

          {/* بخش ۲: لیست دانش‌آموزان و کلیک جهت ویرایش */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <CheckSquare className="w-5 h-5 text-teal-600" />
                <span>لیست دانش‌آموزان و تعیین امتیاز</span>
              </div>

              {/* فیلتر پایه */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setAdminGradeFilter(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      adminGradeFilter === g.id
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
                <span className="text-sm font-[iranSans-r]">در حال دریافت لیست...</span>
              </div>
            ) : students.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-[iranSans-r] text-sm">
                هیچ دانش‌آموزی برای این پایه پیدا نشد.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.map((st) => (
                  <div
                    key={st._id}
                    onClick={() => handleOpenModal(st)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/30 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {st.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-[iranSans-r] mt-1">
                        فعالیت‌های ثبت شده: {st.selectedActivities?.length || 0} مورد
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="block text-xs text-slate-400 font-[iranSans-r]">امتیاز کل</span>
                      <span className="text-lg font-black text-teal-600">{st.totalScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* مودال لیست فعالیت‌ها */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* هدر مودال */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">مدیریت فعالیت‌های {selectedStudent.name}</h3>
                <p className="text-xs text-slate-400 font-[iranSans-r] mt-1">
                  پایه تحصیلی: {GRADES.find((g) => g.id === selectedStudent.grade)?.label}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* جستجو و نوار امتیاز آنلاین */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="جستجوی فعالیت..."
                  value={searchActivity}
                  onChange={(e) => setSearchActivity(e.target.value)}
                  className="w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-[iranSans-r] focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-3 bg-teal-100/80 text-teal-900 px-4 py-2 rounded-2xl">
                <span className="text-xs font-[iranSans-r]">مجموع امتیاز آنلاین:</span>
                <span className="text-xl font-black text-teal-700">{liveCalculatedScore}</span>
              </div>
            </div>

            {/* لیست چک‌باکس‌ها */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {Object.entries(groupedActivities).map(([category, items]) => {
                const filteredItems = items.filter((i) =>
                  i.title.includes(searchActivity)
                );
                if (filteredItems.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredItems.map((act) => {
                        const isChecked = activeCheckboxes.includes(act.id);
                        return (
                          <label
                            key={act.id}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? "bg-teal-50/80 border-teal-400 text-teal-950 font-bold"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleActivity(act.id)}
                                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                              />
                              <span className="font-[iranSans-r]">{act.title}</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                                act.score < 0
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {act.score > 0 ? `+${act.score}` : act.score}
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
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors font-[iranSans-r]"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveActivities}
                disabled={saving}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                تأیید و ثبت امتیاز
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}