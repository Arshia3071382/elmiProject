"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Plus, Send, Trash2 } from "lucide-react"; // اضافه کردن Trash2

interface ISubjectScore {
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  coefficient: number;
}

interface IStudentResult {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  scores: ISubjectScore[];
  totalPercentage: number;
  rank?: number;
  isCompleted: boolean;
}

interface IExam {
  _id: string;
  title: string;
  grade: number;
  isPublished: boolean;
  results: IStudentResult[];
  createdAt: string;
}

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

const toPersianDigits = (n: number | string) =>
  n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

export default function AdminExamsPanel() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [newExamTitle, setNewExamTitle] = useState("");
  const [creatingExam, setCreatingExam] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/exams?grade=${selectedGrade}`);
      const data = await res.json();
      if (data.success) {
        setExams(data.exams);
      }
    } catch (err) {
      console.error("خطا در دریافت آزمون‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [selectedGrade]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;

    setCreatingExam(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newExamTitle, grade: selectedGrade }),
      });
      const data = await res.json();
      if (data.success) {
        setNewExamTitle("");
        fetchExams();
      } else {
        alert(data.error || "خطا در ایجاد آزمون");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingExam(false);
    }
  };

  const handleTogglePublish = async (
    examId: string,
    currentStatus: boolean,
  ) => {
    try {
      const res = await fetch("/api/admin/exams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, isPublished: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchExams();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // تابع حذف آزمون
  const handleDeleteExam = async (examId: string, examTitle: string) => {
    if (!confirm(`آیا از حذف کامل آزمون «${examTitle}» و تمام نمرات دانش‌آموزان آن اطمینان دارید؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/exams`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
        credentials: "include", // <--- این خط کوکی ادمین را به سرور ارسال می‌کند
      });
      const data = await res.json();
      if (data.success) {
        fetchExams(); // رفرش لیست آزمون‌ها
      } else {
        alert(data.error || "خطا در حذف آزمون");
      }
    } catch (err) {
      console.error("خطا در حذف آزمون:", err);
      alert("خطای ارتباط با سرور");
    }
  };
  return (
    <div dir="rtl" className="space-y-6 font-[iranBold]">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">
            مدیریت آزمون‌ها و کارنامه‌ها
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-[iranSans-r]">
            ثبت نمرات جامع، محاسبه درصدها و انتشار در پنل دانش‌آموز
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {GRADES.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-[iranSans-r] ${
                selectedGrade === g.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          افزودن آزمون جدید برای{" "}
          {GRADES.find((g) => g.id === selectedGrade)?.label}
        </h3>
        <form onSubmit={handleCreateExam} className="flex gap-3">
          <input
            type="text"
            placeholder="مثلا: آزمون جامع مهر ۱۴۰۵"
            value={newExamTitle}
            onChange={(e) => setNewExamTitle(e.target.value)}
            className="flex-1 bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-[iranSans-r]"
          />
          <button
            type="submit"
            disabled={creatingExam}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 whitespace-nowrap"
          >
            {creatingExam ? "در حال ایجاد..." : "ایجاد آزمون"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-[iranSans-r]">
          در حال بارگذاری آزمون‌ها...
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100 text-sm font-[iranSans-r]">
          هیچ آزمونی برای این پایه ثبت نشده است.
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">
                    {exam.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-[iranSans-r]">
                    تعداد کل دانش‌آموزان: {toPersianDigits(exam.results.length)}{" "}
                    نفر
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                <button
                  onClick={() =>
                    handleTogglePublish(exam._id, exam.isPublished)
                  }
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    exam.isPublished
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {exam.isPublished
                    ? "بارگذاری شده (غیرفعال‌سازی)"
                    : "بارگذاری در پنل"}
                </button>

                <button
                  onClick={() => router.push(`/admin/exams/${exam._id}`)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  مدیریت نمرات و دانش‌آموزان
                </button>

                {/* دکمه حذف آزمون */}
                <button
                  onClick={() => handleDeleteExam(exam._id, exam.title)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-xl transition-all"
                  title="حذف آزمون"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}