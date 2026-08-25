import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import Exam from "./../../../../../models/Exam";
import { jwtVerify } from "jose";

export async function GET(req: Request) {
  await dbConnect();
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, error: "لطفاً وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

    // 🔒 رمزگشایی و اعتبارسنجی توکن JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );
    
    let studentId = "";
    try {
      const { payload } = await jwtVerify(token.value, secret);
      studentId = payload.userId as string;
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "توکن نامعتبر یا منقضی شده است. لطفاً دوباره وارد شوید." },
        { status: 401 }
      );
    }

    // پیدا کردن اطلاعات دانش‌آموز از دیتابیس
    const student = await Student.findById(studentId).lean();

    if (!student || !student.nationalId) {
      return NextResponse.json(
        { success: false, error: "حساب کاربری یافت نشد یا دسترسی غیرمجاز است." },
        { status: 401 }
      );
    }

    // تبدیل کد ملی به رشته خالص برای مقایسه دقیق بدون مشکل نوع داده (String vs Number)
    const studentNationalId = String(student.nationalId).trim();

    // پیدا کردن تمام آزمون‌های منتشر شده برای پایه تحصیلی دانش‌آموز
    const exams = await Exam.find({
      grade: student.grade,
      isPublished: true,
    }).sort({ createdAt: -1 }).lean();

    // استخراج نمره و کارنامه این دانش‌آموز خاص با مقایسه ایمن
    const studentExams = exams.map((exam: any) => {
      const resultsArray = exam.results || [];
      const myResult = resultsArray.find((r: any) => 
        r && r.nationalId && String(r.nationalId).trim() === studentNationalId
      );

      return {
        _id: exam._id,
        title: exam.title,
        createdAt: exam.createdAt,
        myResult: myResult || null,
      };
    }).filter(item => item.myResult !== null);

    return NextResponse.json({ success: true, exams: studentExams });

  } catch (error) {
    console.error("Error fetching student exams:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت کارنامه‌ها" },
      { status: 500 }
    );
  }
}