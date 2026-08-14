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
  Clock,
} from "lucide-react";
import { LEAGUE_ACTIVITIES, calculateTotalScore } from "./../../../lib/leagueActivities";

// ==================== Types ====================
interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  grade: number;
  selectedActivities: string[];
  totalScore: number;
  published: boolean;
}

interface IGrade {
  id: number;
  label: string;
}

// ==================== Constants ====================
const GRADES: IGrade[] = [
  { id: 2, label: "پایه دوم" },
  { id: 3, label: "پایه سوم" },
  { id: 4, label: "پایه چهارم" },
  { id: 5, label: "پایه پنجم" },
  { id: 6, label: "پایه ششم" },
  { id: 7, label: "پایه هفتم" },
  { id: 8, label: "پایه هشتم" },
  { id: 9, label: "پایه نهم" },
];

const toPersianDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tehran'
  }).format(date);
};

const toPersianDigits = (n: number | string): string => {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

export default function AdminGradeLeaguePanel() {
  // ==================== States ====================
  const [activeGrade, setActiveGrade] = useState<number | null>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // فرم ثبت دانش‌آموز
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("");
  const [newNationalId, setNewNationalId] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);

  // ویرایش دانش‌آموز
  const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);
  const [editFirstName, setEditFirstName] = useState<string>("");
  const [editLastName, setEditLastName] = useState<string>("");
  const [editNationalId, setEditNationalId] = useState<string>("");

  // مودال امتیازات
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [activeCheckboxes, setActiveCheckboxes] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchActivity, setSearchActivity] = useState<string>("");

  // ==================== Functions ====================
  const fetchStudents = useCallback(async () => {
    if (activeGrade === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${activeGrade}`);
      const data = await res.json();
      
      if (data.success && data.students) {
        setStudents(data.students);
        if (data.lastUpdate) {
          setLastUpdate(data.lastUpdate);
        }
      }
    } catch (err) {
      console.error("خطا در دریافت لیست دانش‌آموزان:", err);
    } finally {
      setLoading(false);
    }
  }, [activeGrade]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ==================== Create Student ====================
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim() || !newNationalId.trim() || activeGrade === null) return;

    setCreating(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newFirstName.trim(),
          lastName: newLastName.trim(),
          nationalId: newNationalId.trim(),
          grade: activeGrade,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setNewFirstName("");
        setNewLastName("");
        setNewNationalId("");
        await fetchStudents();
      } else {
        alert(`خطا: ${data.error || "مشکلی در ثبت دانش‌آموز پیش آمد"}`);
      }
    } catch (err) {
      console.error("خطا در ایجاد دانش‌آموز:", err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setCreating(false);
    }
  };

  // ==================== Delete Student ====================
  const handleDeleteStudent = async (id: string) => {
    if (!confirm("آیا از حذف این دانش‌آموز اطمینان دارید؟")) return;
    
    try {
      const res = await fetch(`/api/league/grade?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchStudents();
      } else {
        alert(`خطا: ${data.error || "مشکلی در حذف دانش‌آموز پیش آمد"}`);
      }
    } catch (err) {
      console.error("خطا در حذف دانش‌آموز:", err);
      alert("خطا در ارتباط با سرور");
    }
  };

  // ==================== Edit Student ====================
  const handleEditStudent = (student: IStudent) => {
    setEditingStudent(student);
    setEditFirstName(student.firstName || "");
    setEditLastName(student.lastName || "");
    setEditNationalId(student.nationalId || "");
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    
    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStudent._id,
          firstName: editFirstName,
          lastName: editLastName,
          nationalId: editNationalId,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setEditingStudent(null);
        await fetchStudents();
      } else {
        alert(`خطا: ${data.error || "مشکلی در ویرایش دانش‌آموز پیش آمد"}`);
      }
    } catch (err) {
      console.error("خطا در ویرایش دانش‌آموز:", err);
      alert("خطا در ارتباط با سرور");
    }
  };

  // ==================== Activities Modal ====================
  const handleOpenModal = (student: IStudent) => {
    setSelectedStudent(student);
    setActiveCheckboxes([]);
    setSearchActivity("");
  };

  const toggleActivity = (id: string) => {
    setActiveCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveActivities = async () => {
    if (!selectedStudent) return;
    setSaving(true);

    const addedScore = calculateTotalScore(activeCheckboxes);

    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedStudent._id,
          selectedActivities: activeCheckboxes,
          addedScore: addedScore,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setActiveCheckboxes([]);
        setSelectedStudent(null);
        await fetchStudents();
      } else {
        alert(`خطا: ${data.error || "مشکلی در ذخیره امتیازات پیش آمد"}`);
      }
    } catch (err) {
      console.error("خطا در ذخیره امتیازات:", err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  // ==================== Publish Changes ====================
  const handlePublishChanges = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "PATCH",
      });
      
      const data = await res.json();
      
      if (data.success) {
        setLastUpdate(data.lastUpdate);
        alert("تمامی تغییرات با موفقیت منتشر شد!");
        await fetchStudents();
      } else {
        alert(`خطا: ${data.error || "مشکلی در انتشار تغییرات پیش آمد"}`);
      }
    } catch (err) {
      console.error("خطا در انتشار تغییرات:", err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setIsPublishing(false);
    }
  };

  // ==================== Group Activities ====================
  const groupedActivities = LEAGUE_ACTIVITIES.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof LEAGUE_ACTIVITIES>);

  const liveCalculatedScore = calculateTotalScore(activeCheckboxes);

  // ==================== Render ====================
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
            {/* Header */}
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

              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
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

            {/* دکمه انتشار تغییرات */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-[IRANSansXFaNum-Regular]">
                      آخرین بروزرسانی منتشر شده:
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {lastUpdate ? toPersianDate(lastUpdate) : "هنوز بروزرسانی منتشر نشده"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePublishChanges}
                  disabled={isPublishing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  اعمال تغییرات و بروزرسانی جدول لیگ
                </button>
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
                      نام:
                    </label>
                    <input
                      type="text"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="مثال: محمدجواد"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
                      نام خانوادگی:
                    </label>
                    <input
                      type="text"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="مثال: ابراهیمی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
                      کد ملی:
                    </label>
                    <input
                      type="text"
                      value={newNationalId}
                      onChange={(e) => setNewNationalId(e.target.value)}
                      placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                      maxLength={10}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                      required
                    />
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-[IRANSansXFaNum-Regular]">
                    ثبت در:{" "}
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
                          <th className="py-3 px-3">نام</th>
                          <th className="py-3 px-3">نام خانوادگی</th>
                          <th className="py-3 px-3">کد ملی</th>
                          <th className="py-3 px-3">پایه</th>
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
                            <td className="py-3 px-3 font-bold text-slate-800">
                              {st.firstName || "نامشخص"}
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              {st.lastName || "نامشخص"}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-mono text-xs">
                              {st.nationalId ? toPersianDigits(st.nationalId) : "نامشخص"}
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {GRADES.find((g) => g.id === st.grade)?.label || st.grade}
                            </td>
                            <td className="py-3 px-3 text-center text-xs text-slate-500 font-[IRANSansXFaNum-Regular]">
                              {toPersianDigits(st.selectedActivities?.length || 0)} مورد
                            </td>
                            <td className="py-3 px-3 text-center font-black text-emerald-600 text-base">
                              {toPersianDigits(st.totalScore?.toLocaleString() || 0)}
                            </td>
                            <td className="py-3 px-3 text-left">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditStudent(st)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-bold transition-all"
                                >
                                  ✏️ ویرایش
                                </button>
                                <button
                                  onClick={() => handleOpenModal(st)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  امتیاز
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(st._id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold transition-all"
                                >
                                  🗑️ حذف
                                </button>
                              </div>
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
          مودال امتیازات
         ========================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    افزودن فعالیت و امتیاز: {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-xs text-slate-400 font-[IRANSansXFaNum-Regular]">
                    مقطع: {GRADES.find((g) => g.id === selectedStudent.grade)?.label} | کد ملی: {toPersianDigits(selectedStudent.nationalId || "")}
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
                  امتیاز اضافه شونده:
                </span>
                <span className="text-xl font-black text-emerald-600 font-mono">
                  {toPersianDigits(liveCalculatedScore)}
                </span>
              </div>
            </div>

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
                ذخیره امتیازات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          مودال ویرایش دانش‌آموز
         ========================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                ویرایش دانش‌آموز
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
                  نام:
                </label>
                <input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
                  نام خانوادگی:
                </label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 font-[IRANSansXFaNum-Regular]">
                  کد ملی:
                </label>
                <input
                  type="text"
                  value={editNationalId}
                  onChange={(e) => setEditNationalId(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-[IRANSansXFaNum-Regular]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}