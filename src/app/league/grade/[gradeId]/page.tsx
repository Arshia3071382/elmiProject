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
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-12 font-[iranBold] mt-16 md:mt-20">
      {/* دکمه بازگشت */}
      <div className="mb-6">
        <Link
          href="/league/grade"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-sm font-bold transition-all font-[iranSans-r]"
        >
          <ArrowRight className="w-4 h-4 text-emerald-700" />
          بازگشت به انتخاب پایه
        </Link>
      </div>

      {/* هدر صفحه */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mb-4 border border-emerald-200">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 font-iranBold">
          جدول رتبه‌بندی <span className="text-emerald-700">{currentGradeLabel}</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-[iranSans-r]">
          برترین دانش‌آموزان و آخرین وضعیت امتیازات رقابت‌های علمی
        </p>
      </div>

      {/* جدول اصلی داده‌ها */}
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-emerald-100 bg-emerald-50/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">
              جدول امتیازات
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-[iranSans-r] bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>تعداد شرکت‌کنندگان: {toPersianDigits(students.length)} نفر</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-[iranSans-r]">در حال بروزرسانی جدول رقابت...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium font-[iranSans-r]">
              هنوز هیچ دانش‌آموزی برای این پایه ثبت نشده است.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-emerald-700 text-white font-[iranSans-r]">
                    <th className="p-4 text-right w-16 sm:w-20 font-bold">رتبه</th>
                    <th className="p-4 text-right font-bold">نام و نام خانوادگی</th>
                    <th className="p-4 text-right font-bold">پایه تحصیلی</th>
                    <th className="py-4 pr-4 pl-6 sm:pl-8 text-left font-bold">امتیاز کل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {students.map((student, index) => {
                    const rank = index + 1;
                    let rankBadge = null;
                    let rowBg = "hover:bg-emerald-50/50";

                    if (rank === 1) {
                      rankBadge = <span className="text-xl ml-1">🥇</span>;
                      rowBg = "bg-emerald-100/60 border-r-4 border-emerald-600 hover:bg-emerald-100/80";
                    } else if (rank === 2) {
                      rankBadge = <span className="text-xl ml-1">🥈</span>;
                      rowBg = "bg-emerald-50/80 border-r-4 border-emerald-400 hover:bg-emerald-100/50";
                    } else if (rank === 3) {
                      rankBadge = <span className="text-xl ml-1">🥉</span>;
                      rowBg = "bg-emerald-50/40 border-r-4 border-emerald-300 hover:bg-emerald-50/70";
                    }

                    return (
                      <tr key={student._id} className={`transition duration-150 ${rowBg}`}>
                        <td className="p-4 text-right font-black">
                          <div className="flex items-center gap-1">
                            {rankBadge || (
                              <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-mono text-emerald-800">
                                {toPersianDigits(rank)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-800 break-words whitespace-pre-line sm:whitespace-normal max-w-[120px] sm:max-w-none leading-snug">
                          {student.name ? student.name.trim().replace(/\s+/g, "\n") : ""}
                        </td>
                        <td className="p-4 text-slate-600 font-medium font-[iranSans-r]">
                          {GRADES.find((g) => g.id === student.grade)?.label || currentGradeLabel}
                        </td>
                        <td className="py-4 pr-4 pl-6 sm:pl-8 text-left font-black text-emerald-700 font-mono">
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
  );
}