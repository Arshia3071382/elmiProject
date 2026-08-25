"use client";

import { useState, useEffect } from "react";
import { Trophy, ChevronDown, Award, BookOpen, BarChart3, ListOrdered } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressChart from "@/component/student-dashboard/ProgressChart";

interface ISubjectScore {
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
}

interface IStudentResult {
  scores: ISubjectScore[];
  totalPercentage: number;
  rank?: number;
  isCompleted: boolean;
}

interface IStudentExam {
  _id: string;
  title: string;
  createdAt: string;
  myResult: IStudentResult;
}

const toPersianDigits = (n: number | string) => n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "۱۴۰۵/۰۵/۰۱";
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return "۱۴۰۵/۰۵/۰۱";
  }
};

export default function ExamCard() {
  const [exams, setExams] = useState<IStudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالت نمایش: مقایسه بین حالت «نمودار محور» و «لیست آرشیو» برای مدیریت موبایل
  const [activeTab, setActiveTab] = useState<"chart" | "list">("chart");
  const [openExamId, setOpenExamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyExams = async () => {
      try {
        const res = await fetch("/api/student/exams");
        const data = await res.json();
        if (data.success) {
          setExams(data.exams);
          if (data.exams.length > 0) {
            setOpenExamId(data.exams[0]._id);
          }
        }
      } catch (err) {
        console.error("خطا در دریافت آزمون‌های دانش‌آموز:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyExams();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center text-slate-400 text-xs font-[iranSans-r]">
        در حال بارگذاری کارنامه‌ها...
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center text-slate-400 text-xs font-[iranSans-r]">
        هنوز کارنامه یا آزمون منتشر شده‌ای برای شما ثبت نشده است.
      </div>
    );
  }

  const chartData = exams.map((exam) => {
    const scoresMap: { [key: string]: number } = {};
    exam.myResult.scores.forEach((s) => {
      const name = s.subjectName.toLowerCase();
      if (name.includes("ریاضی")) scoresMap.math = s.percentage;
      else if (name.includes("علوم")) scoresMap.science = s.percentage;
      else if (name.includes("فارسی") || name.includes("ادبیات")) scoresMap.persian = s.percentage;
    });

    return {
      date: formatDate(exam.createdAt),
      examTitle: exam.title,
      general: exam.myResult.totalPercentage,
      ...scoresMap,
    };
  });

  return (
    <div dir="rtl" className="space-y-6 font-[iranBold]">
      
      {/* هدر بخش همراه با سوئیچ‌گر نمای موبایل (Segmented Control) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              عملکرد و کارنامه آزمون‌های جامع
            </h3>
            <p className="text-xs text-slate-400 font-[iranSans-r] mt-0.5">
              مجموع {toPersianDigits(exams.length)} آزمون ثبت شده
            </p>
          </div>
        </div>

        {/* دکمه‌های جابجایی بین نمودار تحلیلی و لیست کارنامه‌ها */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("chart")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "chart"
                ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>روند پیشرفت</span>
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>آرشیو کارنامه‌ها</span>
          </button>
        </div>
      </div>

      {/* محتوای پویا بر اساس تب انتخاب شده */}
      <AnimatePresence mode="wait">
        {activeTab === "chart" ? (
          <motion.div
            key="chart-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ارسال دیتای کارنامه‌ها به کامپوننت نمودار پیشرفت */}
            <ProgressChart data={chartData} />
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin"
          >
            {exams.map((exam) => {
              const isOpen = openExamId === exam._id;
              const result = exam.myResult;

              return (
                <div key={exam._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenExamId(isOpen ? null : exam._id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-all text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">{exam.title}</h4>
                        <span className="text-[11px] text-slate-400 font-[iranSans-r]">تاریخ: {formatDate(exam.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left hidden sm:block">
                        <span className="text-[10px] text-slate-400 block font-[iranSans-r]">درصد کل</span>
                        <span className="text-sm font-black text-emerald-700 font-mono">
                          {toPersianDigits(result.totalPercentage)}%
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 p-4 sm:p-5 bg-white space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {result.scores.map((score, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="font-bold text-slate-700 text-xs sm:text-sm flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                                {score.subjectName}
                              </span>
                              <span className="font-black text-emerald-700 font-mono text-xs sm:text-sm">
                                {toPersianDigits(score.percentage)}%
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl gap-3">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <span className="text-xs font-bold text-slate-800">
                              رتبه شما در بین هم‌پایه‌ها: <strong className="text-emerald-700 font-mono text-sm">{toPersianDigits(result.rank || "-")}</strong>
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            میانگین کل درصد: <strong className="text-emerald-700 font-mono text-sm">{toPersianDigits(result.totalPercentage)}%</strong>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}