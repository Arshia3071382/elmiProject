import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Exam from "./../../../../../models/Exam";
import Student from "./../../../../../models/Student";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token) {
      return NextResponse.json({ success: false, error: "لطفاً وارد شوید." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );
    const { payload } = await jwtVerify(token.value, secret);
    const studentId = payload.userId as string;

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: "دانش‌آموز یافت نشد." }, { status: 404 });
    }

    // دریافت آزمون‌های منتشر شده هم‌رده با پایه دانش‌آموز
    const exams = await Exam.find({
      grade: student.grade,
      isPublished: true,
    }).sort({ createdAt: -1 });

    // استخراج نتیجه‌ی اختصاصی این دانش‌آموز از داخل آرایه results
    const studentExams = exams.map((exam: any) => {
      const myResult = exam.results.find(
        (r: any) => 
          r.studentId?.toString() === studentId || 
          r.nationalId === student.nationalId
      );

      if (!myResult) return null;

      return {
        _id: exam._id,
        title: exam.title,
        createdAt: exam.createdAt,
        myResult: myResult,
      };
    }).filter(Boolean);

    return NextResponse.json({ success: true, exams: studentExams });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}