import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Exam from "./../../../../../models/Exam";
import Student from "./../../../../../models/Student";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function normalizeNationalId(id: string): string {
  if (!id) return "";
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

  let normalized = id.trim();
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianNumbers[i], i.toString());
    normalized = normalized.replace(arabicNumbers[i], i.toString());
  }
  return normalized;
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    // اصلاح نام کوکی به student_token مطابق با فایل لاگین
    const token = cookieStore.get("student_token");

    if (!token) {
      return NextResponse.json({ success: false, error: "لطفاً وارد شوید." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-very-secure-secret-key-12345"
    );
    const { payload } = await jwtVerify(token.value, secret);
    const studentId = (payload.userId || payload.id) as string;

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: "دانش‌آموز یافت نشد." }, { status: 404 });
    }

    const cleanStudentNationalId = normalizeNationalId(student.nationalId);

    // دریافت آزمون‌های منتشر شده هم‌رده با پایه دانش‌آموز
    const exams = await Exam.find({
      grade: student.grade,
      isPublished: true,
    }).sort({ createdAt: -1 });

    // استخراج نتیجه‌ی اختصاصی این دانش‌آموز و ارسال محتوای آزمون
    const studentExams = exams.map((exam: any) => {
      const myResult = exam.results.find(
        (r: any) => 
          (r.studentId && r.studentId.toString() === studentId) || 
          (r.nationalId && cleanStudentNationalId && normalizeNationalId(r.nationalId) === cleanStudentNationalId)
      );

      return {
        _id: exam._id,
        title: exam.title,
        createdAt: exam.createdAt,
        subjects: exam.subjects || [], // ارسال دروس و سوالات آزمون
        myResult: myResult || {
          scores: exam.subjects ? exam.subjects.map((sub: any) => ({
            subjectName: sub.subjectName,
            totalQuestions: sub.totalQuestions || 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            percentage: 0,
            coefficient: sub.coefficient || 1,
          })) : [],
          totalPercentage: 0,
          isCompleted: false,
        },
      };
    });

    return NextResponse.json({ success: true, exams: studentExams });
  } catch (error: any) {
    console.error("Student Exams Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}