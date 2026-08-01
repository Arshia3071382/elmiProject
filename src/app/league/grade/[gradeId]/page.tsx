"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Award, ArrowRight, Sparkles, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function GradeLeagueDetailsPage({ params }: { params: Promise<{ gradeId: string }> }) {
  const resolvedParams = use(params);
  const selectedGrade = parseInt(resolvedParams.gradeId, 10);

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentGradeLabel = GRADES.find((g) => g.id === selectedGrade)?.label || `پایه ${selectedGrade}`;

  const fetchGradeStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${selectedGrade}`).then((r) =>
        r.json()
      );
      if (Array.isArray(res)) {
        setStudents(res);
      }
    } catch (error) {
      console.error("خطا در بارگذاری جدول لیگ پایه:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => {
    fetchGradeStudents();
  }, [fetchGradeStudents]);

  const toPersianDigits = (n: number | string) => {
    return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100/70 text-slate-900 font-[iranBold]mt-10 sm:mt-30 py-10 px-4 sm:px-6 lg:px-8">
      {/* کانتینر اصلی صفحه */}
      <div className="max-w-5xl mx-auto bg-white/80 border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-xl backdrop-blur-sm">
        
        {/* دکمه بازگشت */}
        <div className="mb-8">
          <Link
            href="/league/grade"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 text-sm transition-all duration-300 font-[iranSans-r] shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به انتخاب پایه
          </Link>
        </div>

        {/* هدر صفحه */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-lg mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            جدول رتبه‌بندی <span className="text-slate-700">{currentGradeLabel}</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-[iranSans-r] font-medium">
            برترین دانش‌آموزان و آخرین وضعیت امتیازات رقابت‌های علمی
          </p>
        </div>

        {/* جدول خنثی و بدون رنگ سبز */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-800">
                جدول امتیازات
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-[iranSans-r] bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-slate-500" />
              <span>تعداد شرکت‌کنندگان: {toPersianDigits(students.length)} نفر</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-[iranSans-r]">در حال دریافت جدیدترین امتیازات...</span>
              </div>
            ) : students.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-[iranSans-r]">
                هنوز هیچ دانش‌آموزی برای این پایه ثبت نشده است.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-200 font-[iranSans-r]">
                      <th className="py-4 px-4">رتبه</th>
                      <th className="py-4 px-4">نام و نام خانوادگی</th>
                      <th className="py-4 px-4">پایه تحصیلی</th>
                      <th className="py-4 px-4 text-left">امتیاز کل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student, index) => {
                      const rank = index + 1;
                      let rankBadge = null;
                      let rowBg = "hover:bg-slate-50/80";

                      if (rank === 1) {
                        rankBadge = <span className="text-2xl">🥇</span>;
                        rowBg = "bg-amber-50/60 border-l-4 border-amber-400 hover:bg-amber-50";
                      } else if (rank === 2) {
                        rankBadge = <span className="text-2xl">🥈</span>;
                        rowBg = "bg-slate-100/70 border-l-4 border-slate-400 hover:bg-slate-100";
                      } else if (rank === 3) {
                        rankBadge = <span className="text-2xl">🥉</span>;
                        rowBg = "bg-amber-900/5 border-l-4 border-amber-700 hover:bg-amber-900/10";
                      }

                      return (
                        <tr key={student._id} className={`transition-colors duration-150 ${rowBg}`}>
                          <td className="py-4 px-4 font-black">
                            <div className="flex items-center gap-2">
                              {rankBadge || (
                                <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono text-slate-700">
                                  {toPersianDigits(rank)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">{student.name}</td>
                          <td className="py-4 px-4 text-sm text-slate-500 font-[iranSans-r]">
                            {GRADES.find((g) => g.id === student.grade)?.label || currentGradeLabel}
                          </td>
                          <td className="py-4 px-4 text-left font-black text-slate-900 text-lg font-mono">
                            {toPersianDigits(student.totalScore?.toLocaleString() || 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}