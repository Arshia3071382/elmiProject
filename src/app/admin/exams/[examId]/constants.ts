// Types and constants
export interface IExamSubject {
  subjectName: string;
  totalQuestions: number;
  coefficient: number;
}

export interface ISubjectScore {
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered?: number;
  percentage: number;
  coefficient: number;
}

export interface IStudentResult {
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

export interface IExam {
  _id: string;
  title: string;
  grade: number;
  isPublished: boolean;
  subjects: IExamSubject[];
  results: IStudentResult[];
}

export const DEFAULT_EXAM_SUBJECTS: IExamSubject[] = [
  { subjectName: "ریاضی", totalQuestions: 20, coefficient: 2 },
  { subjectName: "علوم", totalQuestions: 20, coefficient: 2 },
  { subjectName: "فارسی", totalQuestions: 20, coefficient: 2 },
  { subjectName: "عربی", totalQuestions: 15, coefficient: 1 },
  { subjectName: "زبان انگلیسی", totalQuestions: 15, coefficient: 1 },
  { subjectName: "مطالعات اجتماعی", totalQuestions: 15, coefficient: 1 },
  { subjectName: "هدیه‌های آسمان", totalQuestions: 15, coefficient: 1 },
];

// Convert numbers to Persian digits
export const toPersianDigits = (n: number | string) =>
  n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);