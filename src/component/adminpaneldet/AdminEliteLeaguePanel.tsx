"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy, Trash2, Edit3, Plus, X } from "lucide-react";

interface AdminEliteLeaguePanelProps {
  onShowMessage: (type: "success" | "error", text: string) => void;
}

export default function AdminEliteLeaguePanel({ onShowMessage }: AdminEliteLeaguePanelProps) {
  const [category, setCategory] = useState<"elementary" | "highschool">("elementary");
  const [students, setStudents] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    grade: "دوم",
    score: "",
  });

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`/api/elite?category=${category}`).then((r) => r.json());
      if (Array.isArray(res)) {
        setStudents(res);
      }
    } catch {
      onShowMessage("error", "خطا در دریافت لیست نخبگان");
    }
  }, [category, onShowMessage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCategoryChange = (cat: "elementary" | "highschool") => {
    setCategory(cat);
    setFormData({
      id: "",
      name: "",
      grade: cat === "elementary" ? "دوم" : "هفتم",
      score: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.score) {
      return onShowMessage("error", "لطفاً تمامی فیلدها را به درستی تکمیل کنید");
    }

    const payload = {
      id: formData.id || undefined,
      name: formData.name.trim(),
      grade: formData.grade,
      score: Number(formData.score),
      category,
    };

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/elite", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      if (!res.error) {
        onShowMessage("success", isEditing ? "امتیاز با موفقیت بروزرسانی شد" : "دانش‌آموز جدید به لیگ اضافه شد");
        setFormData({ id: "", name: "", grade: category === "elementary" ? "دوم" : "هفتم", score: "" });
        setIsEditing(false);
        fetchStudents();
      } else {
        onShowMessage("error", "خطا در ثبت اطلاعات در دیتابیس");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  const handleEditInit = (student: any) => {
    setIsEditing(true);
    setFormData({
      id: student._id,
      name: student.name,
      grade: student.grade,
      score: student.score.toString(),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این دانش‌آموز از جدول نخبگان اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/elite?id=${id}`, { method: "DELETE" }).then((r) => r.json());
      if (!res.error) {
        onShowMessage("success", "دانش‌آموز با موفقیت حذف شد");
        fetchStudents();
      } else {
        onShowMessage("error", "خطا در حذف رکورد");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  return (
    <div dir="rtl" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-gray-800">مدیریت لیگ نخبگان علمی (۲۰ نفر برتر)</h2>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleCategoryChange("elementary")}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${category === "elementary" ? "bg-amber-500 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
          >
            ابتدایی (دوم تا ششم)
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange("highschool")}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${category === "highschool" ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
          >
            راهنمایی (هفتم تا نهم)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mb-6 text-sm text-gray-700">
        <div>
          <label className="block text-gray-600 mb-1 font-medium">نام و نام خانوادگی:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="مثال: علی احمدی"
            className="w-full border border-gray-200 p-2.5 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1 font-medium">پایه تحصیلی:</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="w-full border border-gray-200 p-2.5 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          >
            {category === "elementary" ? (
              <>
                <option value="دوم">دوم ابتدایی</option>
                <option value="سوم">سوم ابتدایی</option>
                <option value="چهارم">چهارم ابتدایی</option>
                <option value="پنجم">پنجم ابتدایی</option>
                <option value="ششم">ششم ابتدایی</option>
              </>
            ) : (
              <>
                <option value="هفتم">هفتم راهنمایی</option>
                <option value="هشتم">هشتم راهنمایی</option>
                <option value="نهم">نهم راهنمایی</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-1 font-medium">امتیاز کل:</label>
          <input
            type="number"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            required
            placeholder="مثال: 2450"
            className="w-full border border-gray-200 p-2.5 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 text-white p-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isEditing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditing ? "ثبت ویرایش" : "افزودن به لیگ"}
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({ id: "", name: "", grade: category === "elementary" ? "دوم" : "هفتم", score: "" });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2.5 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="p-3 text-right w-16">رتبه</th>
              <th className="p-3 text-right">نام دانش‌آموز</th>
              <th className="p-3 text-right">پایه تحصیلی</th>
              <th className="p-3 text-right">امتیاز</th>
              <th className="p-3 text-center w-24">عملیات ادمین</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">هیچ داده‌ای ثبت نشده است. اولین دانش‌آموز را اضافه کنید.</td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="p-3 text-right font-bold text-gray-500">
                    <span className="text-amber-600">#</span>{index + 1}
                  </td>
                  <td className="p-3 font-semibold text-gray-800">{student.name}</td>
                  <td className="p-3 text-right text-gray-600">{student.grade}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">{student.score.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditInit(student)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(student._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}