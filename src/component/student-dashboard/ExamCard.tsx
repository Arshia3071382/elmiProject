"use client";

import { useState, useEffect } from "react";
import { Trophy, ChevronDown, Award, BookOpen, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ExamCard() {
  const [exams, setExams] = useState<IStudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [openExamId, setOpenExamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyExams = async () => {
      try {
        const res = await fetch("/api/student/exams");
        const data = await res.json();
        if (data.success) {
          setExams(data.exams);
        }
      } catch (err) {
        console.error("خطا در دریافت آزمون‌های دانش‌آموز:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyExams();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenExamId(openExamId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center text-slate-400 text-xs font-[iranSans-r]">
        در حال بارگذاری کارنامه‌ها...
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center text-slate-400 text-xs font-[iranSans-r]">
        هنوز کارنامه یا آزمون منتشر شده‌ای برای شما ثبت نشده است.
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-4 font-[iranBold]">
      <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-emerald-600" />
        کارنامه آزمون‌های جامع
      </h3>

      <div className="space-y-3">
        {exams.map((exam) => {
          const isOpen = openExamId === exam._id;
          const result = exam.myResult;

          return (
            <div key={exam._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
              {/* هدر کارت (قابل کلیک برای باز شدن کشو) */}
              <button
                onClick={() => toggleAccordion(exam._id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-all text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">{exam.title}</h4>
                    <span className="text-[11px] text-slate-400 font-[iranSans-r]">وضعیت: ثبت شده و تایید شده</span>
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

              {/* منوی کشویی جزئیات کارنامه */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100 p-4 sm:p-5 bg-white space-y-4"
                  >
                    {/* درصد دروس */}
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

                    {/* رتبه در آزمون و درصد کل در پایین کشو */}
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
      </div>
    </div>
  );
}