"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy, Award, ArrowRight, ChevronLeft, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function EliteLeaguePublicPage() {
  // مدیریت حالت نمای فعال: null (صفحه انتخاب اولیه) | "elite" (جدول نخبگان)
  const [activeLeague, setActiveLeague] = useState<"elite" | null>(null);

  const [category, setCategory] = useState<"elementary" | "highschool">(
    "elementary"
  );
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/elite?category=${category}`).then((r) =>
        r.json()
      );
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
    if (activeLeague === "elite") {
      fetchStudents();
    }
  }, [activeLeague, fetchStudents]);

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-12 font-[iranBold] mt-16 md:mt-20">
      <AnimatePresence mode="wait">
        {activeLeague === null ? (
          /* =========================================================
             صفحه اول: انتخاب نوع لیگ (دو باکس جذاب و هم‌تراز)
             ========================================================= */
          <motion.div
            key="league-selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* عنوان و توضیحات اصلی */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white mb-4 shadow-lg shadow-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 font-iranBold">
                سامانه رقابت‌های علمی
              </h1>
              <p className="text-gray-500 text-sm md:text-base font-[iranSans-r]">
                لطفاً لیگ مورد نظر خود را برای مشاهده جدول رتبه‌بندی انتخاب کنید
              </p>
            </div>

            {/* گرید دو باکس اصلی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* باکس ۱: لیگ نخبگان (تم طلایی درخشان) */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveLeague("elite")}
                className="group cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white p-8 shadow-xl shadow-amber-500/20 border border-amber-400/30 flex flex-col justify-between min-h-[260px] transition-all duration-300"
              >
                <div className="absolute -left-10 -top-10 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl group-hover:bg-yellow-300/30 transition-all" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                    <Trophy className="w-7 h-7 text-yellow-200" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md font-[iranSans-r] border border-white/20">
                    سطح برتر
                  </span>
                </div>

                <div className="relative z-10 mt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
                    <h2 className="text-2xl font-black font-iranBold text-white">
                      لیگ نخبگان
                    </h2>
                  </div>
                  <p className="text-amber-100 text-sm font-[iranSans-r] leading-relaxed">
                    جدول رتبه‌بندی دانش‌آموزان برتر و ممتاز کل مجموعه‌های علمی
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/15">
                    <span className="text-xs font-bold text-amber-200 font-[iranSans-r]">
                      مشاهده جدول نخبگان
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-all shadow-md">
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* باکس ۲: لیگ علمی پایه (تم فیروزه‌ای/زمردی نوین - هم‌تراز با طلایی) */}
              <Link href="/league/grade" className="block">
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800 text-white p-8 shadow-xl shadow-teal-600/20 border border-teal-400/30 flex flex-col justify-between min-h-[260px] transition-all duration-300"
                >
                  <div className="absolute -left-10 -top-10 w-36 h-36 bg-emerald-300/20 rounded-full blur-2xl group-hover:bg-emerald-300/30 transition-all" />

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Award className="w-7 h-7 text-emerald-200" />
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md font-[iranSans-r] border border-white/20">
                      تفکیک پایه
                    </span>
                  </div>

                  <div className="relative z-10 mt-8">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-emerald-200" />
                      <h2 className="text-2xl font-black font-iranBold text-white">
                        لیگ علمی پایه
                      </h2>
                    </div>
                    <p className="text-teal-100 text-sm font-[iranSans-r] leading-relaxed">
                      مشاهده امتیازات و رقابت‌های علمی به تفکیک پایه‌های تحصیلی
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/15">
                      <span className="text-xs font-bold text-teal-200 font-[iranSans-r]">
                        ورود به جدول پایه‌ها
                      </span>
                      <div className="w-9 h-9 rounded-full bg-white text-teal-700 flex items-center justify-center group-hover:bg-emerald-100 transition-all shadow-md">
                        <ChevronLeft className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* =========================================================
             صفحه دوم: جدول رتبه‌بندی لیگ نخبگان (کد قبلی شما)
             ========================================================= */
          <motion.div
            key="elite-table"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* دکمه بازگشت به صفحه انتخاب لیگ */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setActiveLeague(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-gray-700 text-sm font-bold transition-all font-[iranSans-r]"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به انتخاب لیگ‌ها
              </button>
            </div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-4 border border-amber-100">
                <Trophy className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 font-iranBold">
                لیگ نخبگان علمی
              </h1>
              <p className="text-gray-500 text-sm md:text-base font-[iranSans-r]">
                رتبه‌بندی دانش‌آموزان برتر و فعال مجموعه‌های علمی منتظران
              </p>
            </div>

            {/* سوئیچ مقاطع */}
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
                  مقطع ابتدایی
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
                  مقطع متوسطه اول
                </button>
              </div>
            </div>

            {/* جدول داده‌ها */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm md:text-base">
                  <thead>
                    <tr
                      className={
                        category === "elementary"
                          ? "bg-amber-500 text-white"
                          : "bg-indigo-600 text-white"
                      }
                    >
                      <th className="p-4 text-right w-20 font-bold">رتبه</th>
                      <th className="p-4 text-right font-bold">نام و نام خانوادگی</th>
                      <th className="p-4 text-right font-bold">پایه تحصیلی</th>
                      <th className="p-4 text-right font-bold">امتیاز کل لیگ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-12 text-center text-gray-400 font-medium"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>در حال بروزرسانی جدول رقابت...</span>
                          </div>
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-12 text-center text-gray-400 font-medium"
                        >
                          هیچ داده‌ای در این مقطع ثبت نشده است.
                        </td>
                      </tr>
                    ) : (
                      students.map((student, index) => (
                        <tr
                          key={student._id}
                          className="border-b border-gray-100 hover:bg-gray-50/80 transition duration-150"
                        >
                          <td className="p-4 text-right font-black">
                            {index === 0 && <span className="text-xl ml-1">🥇</span>}
                            {index === 1 && <span className="text-xl ml-1">🥈</span>}
                            {index === 2 && <span className="text-xl ml-1">🥉</span>}
                            {index > 2 && (
                              <span className="text-gray-400 font-mono text-sm ml-2">
                                #
                              </span>
                            )}
                            {index > 2 ? index + 1 : ""}
                          </td>
                          <td className="p-4 font-bold text-gray-800">
                            {student.name}
                          </td>
                          <td className="p-4 text-right text-gray-600 font-medium">
                            {student.grade}
                          </td>
                          <td
                            className={`p-4 text-right font-black ${
                              category === "elementary"
                                ? "text-amber-600"
                                : "text-indigo-600"
                            }`}
                          >
                            {student.score.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}