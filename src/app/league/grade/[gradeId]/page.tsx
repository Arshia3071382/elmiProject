"use client";

import { useState, useEffect, useCallback, use } from "react";
import { ArrowRight, Sparkles, Users, Trophy, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// ==================== Types ====================
interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  grade: number;
  selectedActivities: string[];
  totalScore: number;
  previousRank?: number;
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

// ==================== Level Helper ====================
const getStudentLevel = (score: number) => {
  if (score >= 12500) return { full: "سطح ششم (شهید فخری‌زاده)", short: "شهید فخری‌زاده", color: "bg-amber-100 text-amber-800 border-amber-300" };
  if (score >= 10000) return { full: "سطح پنجم (شهید تهرانی‌مقدم)", short: "شهید تهرانی‌مقدم", color: "bg-orange-100 text-orange-800 border-orange-300" };
  if (score >= 7500) return { full: "سطح چهارم (شهید شهریاری)", short: "شهید شهریاری", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  if (score >= 5000) return { full: "سطح سوم (شهید احمدی‌روشن)", short: "شهید احمدی‌روشن", color: "bg-purple-100 text-purple-800 border-purple-300" };
  if (score >= 2500) return { full: "سطح دوم (شهید علی‌محمدی)", short: "شهید علی‌محمدی", color: "bg-blue-100 text-blue-800 border-blue-300" };
  if (score > 500) return { full: "سطح اول (شهید رضایی‌نژاد)", short: "شهید رضایی‌نژاد", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  
  return { 
    full: "تعیین نشده", 
    short: "-", 
    color: "bg-slate-100 text-slate-500 border-slate-200" 
  };
};

const toPersianDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tehran'
  }).format(date);
};

const toPersianDigits = (n: number | string): string => {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

export default function GradeLeagueDetailsPage({ params }: { params: Promise<{ gradeId: string }> }) {
  const resolvedParams = use(params);
  const selectedGrade = parseInt(resolvedParams.gradeId, 10);

  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const currentGradeLabel = GRADES.find((g) => g.id === selectedGrade)?.label || `پایه ${selectedGrade}`;

  const fetchGradeStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${selectedGrade}&published=true`);
      const data = await res.json();
      
      if (data.success && data.students) {
        setStudents(data.students);
        if (data.lastUpdate) {
          setLastUpdate(data.lastUpdate);
        }
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

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-2 sm:px-4 py-12 font-[iranBold] mt-16 md:mt-20">
      <div className="mb-6">
        <Link
          href="/league/grade"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-sm font-bold transition-all font-[iranSans-r]"
        >
          <ArrowRight className="w-4 h-4 text-emerald-700" />
          بازگشت به انتخاب پایه
        </Link>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mb-4 border border-emerald-200">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-iranBold">
          جدول رتبه‌بندی <span className="text-emerald-700">{currentGradeLabel}</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-base font-[iranSans-r]">
          برترین دانش‌آموزان و آخرین وضعیت امتیازات رقابت‌های علمی
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-6 border-b border-emerald-100 bg-emerald-50/30 gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">جدول امتیازات و سطوح</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {lastUpdate && (
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 font-[iranSans-r] bg-white/70 border border-slate-200 px-2.5 py-1.5 rounded-full shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="whitespace-nowrap">آخرین بروزرسانی: {toPersianDate(lastUpdate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-800 font-[iranSans-r] bg-emerald-100/70 border border-emerald-200 px-2.5 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="whitespace-nowrap">تعداد: {toPersianDigits(students.length)} نفر</span>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-[iranSans-r]">در حال بروزرسانی جدول رقابت...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium font-[iranSans-r]">هنوز هیچ دانش‌آموزی برای این پایه ثبت نشده است.</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs sm:text-base table-auto">
                <thead>
                  <tr className="bg-emerald-700 text-white font-[iranSans-r]">
                    <th className="p-2 sm:p-4 text-right w-10 sm:w-16 font-bold">رتبه</th>
                    <th className="p-2 sm:p-4 text-center w-8 sm:w-20 font-bold">روند</th>
                    <th className="p-2 text-right sm:hidden font-bold">نام و خانوادگی</th>
                    <th className="p-4 text-right hidden sm:table-cell font-bold">نام</th>
                    <th className="p-4 text-right hidden sm:table-cell font-bold">نام خانوادگی</th>
                    <th className="p-2 sm:p-4 text-center font-bold">سطح</th>
                    <th className="py-2 pr-1 pl-2 sm:py-4 sm:pr-4 sm:pl-8 text-left font-bold">امتیاز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {students.map((student, index) => {
                    const currentRank = index + 1;
                    const studentLevel = getStudentLevel(student.totalScore || 0);
                    let rankBadge = null;
                    let rowBg = "hover:bg-emerald-50/50";

                    if (currentRank === 1) { rankBadge = <span className="text-sm sm:text-xl ml-0.5">🥇</span>; rowBg = "bg-emerald-100/60 border-r-4 border-emerald-600 hover:bg-emerald-100/80"; }
                    else if (currentRank === 2) { rankBadge = <span className="text-sm sm:text-xl ml-0.5">🥈</span>; rowBg = "bg-emerald-50/80 border-r-4 border-emerald-400 hover:bg-emerald-100/50"; }
                    else if (currentRank === 3) { rankBadge = <span className="text-sm sm:text-xl ml-0.5">🥉</span>; rowBg = "bg-emerald-50/40 border-r-4 border-emerald-300 hover:bg-emerald-50/70"; }

                    // اگر رتبه قبلی وجود داشته باشد، صعود یعنی (رتبه قبلی > رتبه فعلی)
                    // فرمول دقیق اختلاف رتبه: رتبه قبلی منهای رتبه فعلی
                    // اگر مثبت شود یعنی صعود کرده (چون رتبه عددی کمتر شده)
                    const prevRank = student.previousRank && student.previousRank > 0 ? student.previousRank : currentRank;
                    const rankDiff = prevRank - currentRank;

                    return (
                      <tr key={student._id} className={`transition duration-150 ${rowBg}`}>
                        {/* رتبه */}
                        <td className="p-2 sm:p-4 text-right font-black">
                          <div className="flex items-center gap-1">
                            {rankBadge || (<span className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[10px] sm:text-xs font-mono text-emerald-800">{toPersianDigits(currentRank)}</span>)}
                          </div>
                        </td>

                        {/* ستون روند صعود/نزول */}
                        <td className="p-2 sm:p-4 text-center">
                          <div className="flex items-center justify-center">
                            {rankDiff > 0 ? (
                              <span className="text-emerald-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 sm:bg-emerald-50 sm:px-2 sm:py-1 sm:rounded-lg sm:border sm:border-emerald-200" title={`صعود ${rankDiff} پله‌ای`}>
                                ▲ <span className="hidden sm:inline font-mono">{toPersianDigits(rankDiff)}</span>
                              </span>
                            ) : rankDiff < 0 ? (
                              <span className="text-rose-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 sm:bg-rose-50 sm:px-2 sm:py-1 sm:rounded-lg sm:border sm:border-rose-200" title={`سقوط ${Math.abs(rankDiff)} پله‌ای`}>
                                ▼ <span className="hidden sm:inline font-mono">{toPersianDigits(Math.abs(rankDiff))}</span>
                              </span>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </div>
                        </td>

                        {/* موبایل: نام و نام خانوادگی */}
                        <td className="p-2 font-bold text-slate-800 sm:hidden">
                          <div className="flex flex-col">
                            <span className="text-slate-900 text-xs">{student.firstName || "نامشخص"}</span>
                            <span className="text-slate-500 font-medium text-[10px]">{student.lastName || "نامشخص"}</span>
                          </div>
                        </td>

                        {/* دسکتاپ: نام */}
                        <td className="p-4 font-bold text-slate-800 hidden sm:table-cell">
                          <span>{student.firstName || "نامشخص"}</span>
                        </td>

                        {/* دسکتاپ: نام خانوادگی */}
                        <td className="p-4 font-bold text-slate-800 hidden sm:table-cell">{student.lastName || "نامشخص"}</td>

                        {/* سطح */}
                        <td className="p-2 sm:p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-3 py-1 rounded-md sm:rounded-xl text-[9px] sm:text-xs font-bold border ${studentLevel.color} shadow-xs font-[iranSans-r]`}>
                            <ShieldCheck className="w-3 h-3 hidden sm:inline-block" />
                            <span className="sm:hidden">{studentLevel.short}</span>
                            <span className="hidden sm:inline">{studentLevel.full}</span>
                          </span>
                        </td>

                        {/* امتیاز کل */}
                        <td className="py-2 pr-1 pl-2 sm:py-4 sm:pr-4 sm:pl-8 text-left font-black text-emerald-700 font-mono text-[11px] sm:text-base">
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