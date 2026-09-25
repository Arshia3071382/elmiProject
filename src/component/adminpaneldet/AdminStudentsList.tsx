"use client";

import { useEffect, useState } from "react";
import { Trash2, Users, Search, AlertCircle } from "lucide-react";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  grade: number | string;
  createdAt: string;
}

interface AdminStudentsListProps {
  onShowMessage: (type: "success" | "error", text: string) => void;
}

export default function AdminStudentsList({ onShowMessage }: AdminStudentsListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // دریافت لیست دانش‌آموزان ثبت‌نام شده
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/students", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setStudents(data.students || []);
      } else {
        onShowMessage("error", data.error || "خطا در دریافت لیست دانش‌آموزان");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // تابع حذف دانش‌آموز
  const handleDeleteStudent = async (id: string, fullName: string) => {
    if (!confirm(`آیا از حذف «${fullName}» اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onShowMessage("success", "دانش‌آموز با موفقیت حذف شد");
        setStudents(students.filter((s) => s._id !== id));
      } else {
        onShowMessage("error", data.error || "خطا در حذف دانش‌آموز");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور جهت حذف");
    } finally {
      setDeletingId(null);
    }
  };

  // فیلتر کردن بر اساس جستجو (نام، نام خانوادگی یا نام کاربری)
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
    const username = (student.username || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || username.includes(term);
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر بخش */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>لیست دانش‌آموزان ثبت‌نام‌شده</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مشاهده اطلاعات ثبت‌نام، پایه تحصیلی و مدیریت کاربران سامانه.
          </p>
        </div>

        {/* سرچ باکس */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی نام یا نام کاربری..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* محتوا / جدول */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs font-bold">هیچ دانش‌آموزی یافت نشد.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">ردیف</th>
                <th className="p-4">نام و نام خانوادگی</th>
                <th className="p-4">نام کاربری / شماره</th>
                <th className="p-4">پایه تحصیلی</th>
                <th className="p-4">تاریخ ثبت‌نام</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((student, index) => {
                const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
                return (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-400">{index + 1}</td>
                    <td className="p-4 font-bold text-slate-800">
                      {fullName || "بدون نام"}
                    </td>
                    <td className="p-4 text-slate-600 font-mono" dir="ltr">
                      {student.username}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-[11px]">
                        پایه {student.grade}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString("fa-IR")
                        : "نامشخص"}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteStudent(student._id, fullName || student.username)}
                        disabled={deletingId === student._id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer"
                        title="حذف دانش‌آموز"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === student._id ? "در حال حذف..." : "حذف"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}