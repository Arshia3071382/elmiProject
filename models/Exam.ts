import mongoose, { Schema, Document } from "mongoose";

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
  percentage: number;
  coefficient?: number; // ضریب درس (پیش‌فرض ۱)
}

export interface IStudentExamResult {
  studentId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  nationalId: string;
  scores: ISubjectScore[];
  totalPercentage: number; // میانگین کل با احتساب ضرایب
  rank?: number; // رتبه در بین هم‌پایه‌ها در این آزمون
  isCompleted: boolean; // آیا نمرات ثبت شده‌اند؟ (تیک سبز)
}

export interface IExam extends Document {
  title: string; // مثل: آزمون جامع مهر ۱۴۰۵
  grade: number; // پایه تحصیلی (۲ تا ۹)
  isPublished: boolean; // آیا در پنل دانش‌آموز بارگذاری شده؟
  subjects: IExamSubject[]; // ۱. اضافه شدن اینترفیس دروس سراسری آزمون
  results: IStudentExamResult[];
  createdAt: Date;
}

const ExamSubjectSchema = new Schema<IExamSubject>({
  subjectName: { type: String, required: true },
  totalQuestions: { type: Number, required: true, default: 0 },
  coefficient: { type: Number, default: 1 },
});

const SubjectScoreSchema = new Schema<ISubjectScore>({
  subjectName: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  coefficient: { type: Number, default: 1 },
});

const StudentExamResultSchema = new Schema<IStudentExamResult>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "GradeStudent",
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationalId: { type: String, required: true },
  scores: [SubjectScoreSchema],
  totalPercentage: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
});

const ExamSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    grade: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    subjects: [ExamSubjectSchema],
    results: [StudentExamResultSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Exam ||
  mongoose.model<IExam>("Exam", ExamSchema);