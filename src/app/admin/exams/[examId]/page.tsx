// Exam detail page - Main component
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/component/Container";
import ExamHeader from "./ExamHeader";
import ExamSubjectsEditor from "./ExamSubjectsEditor";
import StudentList from "./StudentList";
import ScoreModal from "./ScoreModal";
import { IExam, IExamSubject, IStudentResult, ISubjectScore, DEFAULT_EXAM_SUBJECTS } from "./constants";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  // State
  const [exam, setExam] = useState<IExam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeStudent, setActiveStudent] = useState<IStudentResult | null>(null);
  const [modalScores, setModalScores] = useState<ISubjectScore[]>([]);
  const [savingScores, setSavingScores] = useState(false);

  // Subjects editor state
  const [examSubjects, setExamSubjects] = useState<IExamSubject[]>(DEFAULT_EXAM_SUBJECTS);
  const [isEditingSubjects, setIsEditingSubjects] = useState(false);
  const [savingExamSubjects, setSavingExamSubjects] = useState(false);

  // Fetch exam details
  const fetchExamDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/exams`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const found = data.exams.find((e: IExam) => e._id === examId);
        if (found) {
          const subjectsList = (!found.subjects || found.subjects.length === 0) 
            ? DEFAULT_EXAM_SUBJECTS 
            : found.subjects;
          setExam({ ...found, subjects: subjectsList });
          setExamSubjects(subjectsList);
        }
      } else {
        console.error("Auth error:", data.error);
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

  // Save exam subjects
  const handleSaveExamSubjects = async () => {
    if (!exam) return;
    setSavingExamSubjects(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

  // Open score modal
  const openScoreModal = (student: IStudentResult) => {
    setActiveStudent(student);
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

  // Save student scores
  const handleSaveStudentScores = async () => {
    if (!exam || !activeStudent) return;
    setSavingScores(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

  // Score change handler
  const handleScoreChange = (index: number, field: "correctAnswers" | "wrongAnswers", value: number) => {
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

  // Calculate modal total
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

  // Subject handlers - با تایپ‌دهی درست
  const handleSubjectChange = (index: number, field: keyof IExamSubject, value: number): void => {
    const updated: IExamSubject[] = [...examSubjects];
    updated[index] = { ...updated[index], [field]: value };
    setExamSubjects(updated);
  };

  const handleRemoveSubject = (index: number): void => {
    const updated: IExamSubject[] = examSubjects.filter((_, i) => i !== index);
    setExamSubjects(updated);
  };

  const handleAddSubject = (subject: IExamSubject): void => {
    setExamSubjects((prev: IExamSubject[]) => [...prev, subject]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-[iranSans-r]">
        در حال بارگذاری اطلاعات آزمون...
      </div>
    );
  }

  // Not found
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

  // Filtered students
  const filteredStudents = exam.results.filter(
    (stu) =>
      `${stu.firstName} ${stu.lastName}`.includes(searchTerm) ||
      stu.nationalId.includes(searchTerm),
  );

  // Get current subjects for display
  const currentSubjects: IExamSubject[] = isEditingSubjects ? examSubjects : (exam.subjects || DEFAULT_EXAM_SUBJECTS);

  return (
    <Container>
      <div dir="rtl" className="space-y-6 mt-10 sm:mt-30 font-[iranBold]">
        <ExamHeader
          title={exam.title}
          studentCount={exam.results.length}
          searchTerm={searchTerm}
          onBack={() => router.back()}
          onSearchChange={setSearchTerm}
        />

        <ExamSubjectsEditor
          examSubjects={currentSubjects}
          isEditing={isEditingSubjects}
          saving={savingExamSubjects}
          onToggleEdit={() => {
            setExamSubjects(exam.subjects || DEFAULT_EXAM_SUBJECTS);
            setIsEditingSubjects(true);
          }}
          onCancel={() => {
            setExamSubjects(exam.subjects || DEFAULT_EXAM_SUBJECTS);
            setIsEditingSubjects(false);
          }}
          onSave={handleSaveExamSubjects}
          onSubjectChange={handleSubjectChange}
          onRemoveSubject={handleRemoveSubject}
          onAddSubject={handleAddSubject}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-4 sm:p-6">
          <StudentList students={filteredStudents} onStudentSelect={openScoreModal} />
        </div>

        <ScoreModal
          student={activeStudent}
          scores={modalScores}
          saving={savingScores}
          onClose={() => setActiveStudent(null)}
          onScoreChange={handleScoreChange}
          onSave={handleSaveStudentScores}
        />
      </div>
    </Container>
  );
}