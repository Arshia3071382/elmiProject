"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";

export default function EliteLeaguePublicPage() {
  const [category, setCategory] = useState<"elementary" | "highschool">("elementary");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/elite?category=${category}`).then((r) => r.json());
      if (Array.isArray(res)) {
        setStudents(res);
      }
    } catch (error) {
      console.error("خطا در بارگذاری جدول نخبگان:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-12 font-sans">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-4 border border-amber-100">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2"> لیگ نخبگان علمی</h1>
        <p className="text-gray-500 text-sm md:text-base">رتبه‌بندی دانش‌آموزان برتر و فعال مجموعه‌های علمی منتظران</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200/50 shadow-inner">
          <button
            type="button"
            onClick={() => setCategory("elementary")}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              category === "elementary" 
                ? "bg-amber-500 text-white shadow-md" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            مقطع ابتدایی (دوم تا ششم)
          </button>
          <button
            type="button"
            onClick={() => setCategory("highschool")}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              category === "highschool" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            مقطع متوسطه اول (هفتم تا نهم)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm md:text-base">
            <thead>
              <tr className={category === "elementary" ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"}>
                <th className="p-4 text-right w-20 font-bold">رتبه</th>
                <th className="p-4 text-right font-bold">نام و نام خانوادگی</th>
                <th className="p-4 text-right font-bold">پایه تحصیلی</th>
                <th className="p-4 text-right font-bold">امتیاز کل لیگ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>در حال بروزرسانی جدول رقابت...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">هیچ داده‌ای در این مقطع ثبت نشده است.</td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50/80 transition duration-150">
                    <td className="p-4 text-right font-black">
                      {index === 0 && <span className="text-xl mr-1">🥇</span>}
                      {index === 1 && <span className="text-xl mr-1">🥈</span>}
                      {index === 2 && <span className="text-xl mr-1">🥉</span>}
                      {index > 2 && <span className="text-gray-400 font-mono text-sm ml-2">#</span>}
                      {index > 2 ? index + 1 : ""}
                    </td>
                    <td className="p-4 font-bold text-gray-800">{student.name}</td>
                    <td className="p-4 text-right text-gray-600 font-medium">{student.grade}</td>
                    <td className={`p-4 text-right font-black ${category === "elementary" ? "text-amber-600" : "text-indigo-600"}`}>
                      {student.score.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}