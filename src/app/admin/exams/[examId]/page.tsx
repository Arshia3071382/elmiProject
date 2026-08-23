"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  User,
  ArrowRight,
  Search,
  Trash2,
  X,
  BookOpen,
  Settings,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/component/Container";

interface IExamSubject {
  subjectName: string;
  totalQuestions: number;
  coefficient: number;
}

interface ISubjectScore {
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered?: number;
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
  subjects: IExamSubject[];
  results: IStudentResult[];
}

const DEFAULT_EXAM_SUBJECTS: IExamSubject[] = [
  { subjectName: "ریاضی", totalQuestions: 20, coefficient: 2 },
  { subjectName: "علوم", totalQuestions: 20, coefficient: 2 },
  { subjectName: "فارسی", totalQuestions: 20, coefficient: 2 },
  { subjectName: "عربی", totalQuestions: 15, coefficient: 1 },
  { subjectName: "زبان انگلیسی", totalQuestions: 15, coefficient: 1 },
  { subjectName: "مطالعات اجتماعی", totalQuestions: 15, coefficient: 1 },
  { subjectName: "هدیه‌های آسمان", totalQuestions: 15, coefficient: 1 },
];

const toPersianDigits = (n: number | string) =>
  n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<IExam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [activeStudent, setActiveStudent] = useState<IStudentResult | null>(null);
  const [modalScores, setModalScores] = useState<ISubjectScore[]>([]);
  const [savingScores, setSavingScores] = useState(false);

  // وضعیت ویرایش دروس سراسری آزمون
  const [examSubjects, setExamSubjects] = useState<IExamSubject[]>([]);
  const [isEditingSubjects, setIsEditingSubjects] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubTotal, setNewSubTotal] = useState<number | "">("");
  const [newSubCoeff, setNewSubCoeff] = useState<number | "">(1);
  const [savingExamSubjects, setSavingExamSubjects] = useState(false);

 const fetchExamDetails = async () => {
    setLoading(true);
    try {
      // اگر اندپوینت شما از ID درپذیر پشتیبانی می‌کند (مثل /api/admin/exams?id=...) یا مسیر اختصاصی:
      const res = await fetch(`/api/admin/exams`);
      const data = await res.json();
      if (data.success) {
        const found = data.exams.find((e: IExam) => e._id === examId);
        if (found) {
          const subjectsList = (!found.subjects || found.subjects.length === 0) 
            ? DEFAULT_EXAM_SUBJECTS 
            : found.subjects;

          // ست کردن مستقیم داده‌های جدید دریافتی از سرور
          setExam({ ...found, subjects: subjectsList });
          setExamSubjects(subjectsList);
        }
      }
    } catch (err) {
      console.error("خطا در دریافت اطلاعات آزمون:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (examId) fetchExamDetails();
  }, [examId]);

  const handleSaveExamSubjects = async () => {
    if (!exam) return;
    setSavingExamSubjects(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam._id,
          action: "update_subjects",
          subjects: examSubjects,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
        setExamSubjects(data.exam.subjects);
        setIsEditingSubjects(false);
      } else {
        alert(data.error || "خطا در ذخیره دروس آزمون");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingExamSubjects(false);
    }
  };

  const handleAddSubjectToExam = () => {
    if (!newSubName.trim() || newSubTotal === "" || Number(newSubTotal) <= 0) {
      alert("لطفاً نام درس و تعداد کل سوالات معتبر وارد کنید.");
      return;
    }
    setExamSubjects([
      ...examSubjects,
      {
        subjectName: newSubName.trim(),
        totalQuestions: Number(newSubTotal),
        coefficient: Number(newSubCoeff) || 1,
      },
    ]);
    setNewSubName("");
    setNewSubTotal("");
    setNewSubCoeff(1);
  };

  const handleRemoveSubjectFromExam = (index: number) => {
    setExamSubjects(examSubjects.filter((_, i) => i !== index));
  };

  const openScoreModal = (student: IStudentResult) => {
    setActiveStudent(student);
    // استفاده از لیست به‌روز دروس آزمون (در حالت ویرایش یا ذخیره شده)
    const currentExamSubjects = isEditingSubjects ? examSubjects : (exam?.subjects || DEFAULT_EXAM_SUBJECTS);

    const initialScores: ISubjectScore[] = currentExamSubjects.map((sub) => {
      const existingScore = student.scores?.find((s) => s.subjectName === sub.subjectName);
      const total = sub.totalQuestions || 0;
      const correct = existingScore ? existingScore.correctAnswers : 0;
      const wrong = existingScore ? existingScore.wrongAnswers : 0;
      const unanswered = Math.max(0, total - (correct + wrong));
      const rawScore = (correct * 3) - wrong;
      const maxScore = total * 3;
      const percentage = maxScore > 0 ? Number(((rawScore / maxScore) * 100).toFixed(2)) : 0;

      return {
        subjectName: sub.subjectName,
        totalQuestions: total,
        correctAnswers: correct,
        wrongAnswers: wrong,
        unanswered: unanswered,
        percentage: percentage,
        coefficient: sub.coefficient,
      };
    });

    setModalScores(initialScores);
  };

  const handleScoreChange = (index: number, field: 'correctAnswers' | 'wrongAnswers', value: number) => {
    const updatedScores = [...modalScores];
    const currentSubject = updatedScores[index];

    let val = value;
    if (isNaN(val) || val < 0) val = 0;

    currentSubject[field] = val;

    const total = currentSubject.totalQuestions;
    const correct = currentSubject.correctAnswers || 0;
    const incorrect = currentSubject.wrongAnswers || 0;

    if (correct + incorrect > total) {
      alert("مجموع پاسخ‌های درست و غلط نمی‌تواند از تعداد کل سوالات آن درس بیشتر باشد!");
      currentSubject[field] = 0;
      return;
    }

    currentSubject.unanswered = Math.max(0, total - (currentSubject.correctAnswers + currentSubject.wrongAnswers));

    const rawScore = (currentSubject.correctAnswers * 3) - currentSubject.wrongAnswers;
    const maxScore = total * 3;
    currentSubject.percentage = maxScore > 0 ? Number(((rawScore / maxScore) * 100).toFixed(2)) : 0;

    setModalScores(updatedScores);
  };

  const calculateModalTotal = () => {
    let totalWeightedPercentage = 0;
    let totalCoefficients = 0;
    modalScores.forEach((s) => {
      const coeff = Number(s.coefficient) || 1;
      totalWeightedPercentage += Number(s.percentage || 0) * coeff;
      totalCoefficients += coeff;
    });
    return totalCoefficients > 0 ? (totalWeightedPercentage / totalCoefficients).toFixed(2) : "0";
  };

  const handleSaveStudentScores = async () => {
    if (!exam || !activeStudent) return;
    setSavingScores(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam._id,
          studentId: activeStudent.studentId || activeStudent._id,
          resultId: activeStudent._id,
          scores: modalScores,
          totalPercentage: Number(calculateModalTotal()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
        setActiveStudent(null);
      } else {
        alert(data.error || "خطا در ذخیره نمرات");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingScores(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-[iranSans-r]">
        در حال بارگذاری اطلاعات آزمون...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-500">آزمون مورد نظر یافت نشد.</p>
        <button
          onClick={() => router.back()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          بازگشت
        </button>
      </div>
    );
  }

  const filteredStudents = exam.results.filter(
    (stu) =>
      `${stu.firstName} ${stu.lastName}`.includes(searchTerm) ||
      stu.nationalId.includes(searchTerm),
  );

  return (
    <Container>
      <div dir="rtl" className="space-y-6 mt-10 sm:mt-30 font-[iranBold]">
        {/* هدر صفحه */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-800">{exam.title}</h2>
              <span className="text-xs text-slate-400 font-[iranSans-r]">
                مدیریت نمرات و کارنامه • کل دانش‌آموزان: {toPersianDigits(exam.results.length)} نفر
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی نام یا کد ملی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-[iranSans-r] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* بخش تنظیمات کلی دروس، تعداد سوالات و امکان افزودن/حذف در بالای صفحه */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-slate-800 text-sm sm:text-base">
                ساختار دروس و تعداد کل سوالات این آزمون
              </h3>
            </div>
            {!isEditingSubjects ? (
              <button
                onClick={() => {
                  setExamSubjects(exam.subjects || DEFAULT_EXAM_SUBJECTS);
                  setIsEditingSubjects(true);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                مدیریت و ویرایش دروس
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setExamSubjects(exam.subjects || DEFAULT_EXAM_SUBJECTS);
                    setIsEditingSubjects(false);
                  }}
                  className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSaveExamSubjects}
                  disabled={savingExamSubjects}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  {savingExamSubjects ? "در حال ذخیره..." : "ذخیره تغییرات ساختار دروس"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(isEditingSubjects ? examSubjects : exam.subjects || DEFAULT_EXAM_SUBJECTS).map((sub, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 text-sm">{sub.subjectName}</div>
                  {isEditingSubjects && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubjectFromExam(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 bg-rose-50 rounded-lg cursor-pointer"
                      title="حذف این درس"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {isEditingSubjects ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">کل سوالات</label>
                      <input
                        type="number"
                        value={sub.totalQuestions}
                        onChange={(e) => {
                          const updated = [...examSubjects];
                          updated[idx].totalQuestions = Number(e.target.value);
                          setExamSubjects(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-amber-700 block mb-0.5">ضریب</label>
                      <input
                        type="number"
                        step="0.5"
                        value={sub.coefficient}
                        onChange={(e) => {
                          const updated = [...examSubjects];
                          updated[idx].coefficient = Number(e.target.value);
                          setExamSubjects(updated);
                        }}
                        className="w-full bg-amber-50 border border-amber-300 rounded-lg p-1.5 text-xs text-center font-bold text-amber-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>کل سوالات: <strong className="text-slate-800">{toPersianDigits(sub.totalQuestions)}</strong></span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">ضریب: {toPersianDigits(sub.coefficient)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* پنل افزودن درس جدید در حالت ویرایش */}
          {isEditingSubjects && (
            <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row items-end gap-3 pt-4">
              <div className="w-full sm:flex-1">
                <label className="text-[11px] text-emerald-900 font-bold block mb-1">نام درس جدید</label>
                <input
                  type="text"
                  placeholder="مثلاً: هدیه‌های آسمان"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-[iranSans-r]"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="text-[11px] text-emerald-900 font-bold block mb-1">تعداد کل سوالات</label>
                <input
                  type="number"
                  placeholder="تعداد"
                  value={newSubTotal}
                  onChange={(e) => setNewSubTotal(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-center font-bold font-mono"
                />
              </div>
              <div className="w-full sm:w-28">
                <label className="text-[11px] text-emerald-900 font-bold block mb-1">ضریب</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="ضریب"
                  value={newSubCoeff}
                  onChange={(e) => setNewSubCoeff(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-center font-bold font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSubjectToExam}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                افزودن درس
              </button>
            </div>
          )}
        </div>

        {/* لیست دانش‌آموزان */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-4 sm:p-6">
          <div className="space-y-3">
            {[...filteredStudents]
              .sort((a, b) => (a.rank || 999) - (b.rank || 999))
              .map((stu) => (
                <div
                  key={stu.studentId || stu._id}
                  onClick={() => openScoreModal(stu)}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer bg-white shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {stu.firstName} {stu.lastName}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        کد ملی: {toPersianDigits(stu.nationalId)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {stu.isCompleted && stu.rank ? (
                      <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
                        رتبه: {toPersianDigits(stu.rank)}
                      </span>
                    ) : null}

                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-[iranSans-r]">
                        درصد کل
                      </span>
                      <span className="text-sm font-black text-emerald-700 font-mono">
                        {toPersianDigits(stu.totalPercentage)}%
                      </span>
                    </div>

                    <div>
                      {stu.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* مودال ثبت نمرات */}
        <AnimatePresence>
          {activeStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden my-4 sm:my-8"
              >
                <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base">
                    ثبت نمرات: {activeStudent.firstName} {activeStudent.lastName}
                  </h3>
                  <button
                    onClick={() => setActiveStudent(null)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-3">
                    {modalScores.map((score, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200"
                      >
                        <div className="col-span-2 sm:col-span-4 font-black text-slate-800 text-sm">
                          {score.subjectName}
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                            کل سوالات: {toPersianDigits(score.totalQuestions)} | ضریب: {toPersianDigits(score.coefficient)}
                          </span>
                        </div>

                        {/* درست */}
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-600 block mb-1 font-bold">صحیح</label>
                          <input
                            type="number"
                            value={score.correctAnswers || ""}
                            onChange={(e) => handleScoreChange(index, "correctAnswers", Number(e.target.value))}
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-center font-mono text-emerald-600 font-bold"
                          />
                        </div>

                        {/* غلط */}
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[10px] text-rose-600 block mb-1 font-bold">غلط</label>
                          <input
                            type="number"
                            value={score.wrongAnswers || ""}
                            onChange={(e) => handleScoreChange(index, "wrongAnswers", Number(e.target.value))}
                            className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-center font-mono text-rose-600 font-bold"
                          />
                        </div>

                        {/* نزده */}
                        <div className="col-span-1 sm:col-span-2 text-center bg-slate-200/60 py-2 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">نزده</span>
                          <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                            {toPersianDigits(score.unanswered ?? 0)}
                          </span>
                        </div>

                        {/* درصد درس */}
                        <div className="col-span-1 sm:col-span-2 text-center bg-white py-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                          <span className="text-[10px] text-slate-400">درصد</span>
                          <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                            {toPersianDigits(score.percentage)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-emerald-900">
                      میانگین کل درصد دروس با احتساب ضرایب:
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                      {toPersianDigits(calculateModalTotal())}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStudent(null)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all text-center"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    disabled={savingScores}
                    onClick={handleSaveStudentScores}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/20 text-center"
                  >
                    {savingScores ? "در حال ثبت..." : "ثبت کارنامه دانش‌آموز"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}