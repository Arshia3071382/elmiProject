import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../lib/dbConnect";
import Student from "./../../../../models/Student";
import GradeStudent from "./../../../../models/GradeStudent";
import Exam from "./../../../../models/Exam";

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

// بررسی احراز هویت ادمین
async function checkAdminAuth(cookieStore: any) {
  const adminToken = cookieStore.get("adminToken") || cookieStore.get("token");
  return !!adminToken;
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const url = new URL(req.url);
    const gradeParam = url.searchParams.get("grade");

    const isAdmin = await checkAdminAuth(cookieStore);

    if (isAdmin || gradeParam) {
      const query: any = {};
      if (gradeParam) {
        query.grade = Number(gradeParam);
      }
      
      const exams = await Exam.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, exams });
    }

    // درخواست دانش‌آموزی
    const token = cookieStore.get("studentToken");
    let student = null;

    if (token && token.value) {
      try {
        student = await Student.findById(token.value);
      } catch (e) {}
    }

    if (!student) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز یا کاربر یافت نشد." },
        { status: 401 }
      );
    }

    const cleanStudentNationalId = normalizeNationalId(student.nationalId);

    let gradeRecord = null;
    if (student.leagueProfile) {
      gradeRecord = await GradeStudent.findById(student.leagueProfile);
    }

    if (!gradeRecord && cleanStudentNationalId) {
      const allGradeStudents = await GradeStudent.find({});
      gradeRecord = allGradeStudents.find(
        (gs) => normalizeNationalId(gs.nationalId) === cleanStudentNationalId
      );
    }

    const grade = gradeRecord?.grade || student.grade || 6;

    const exams = await Exam.find({
      grade: grade,
      isPublished: true,
    }).sort({ createdAt: -1 });

    const studentExams = exams.map((exam) => {
      const myResult = exam.results.find(
        (r: any) =>
          r.studentId === student._id.toString() ||
          normalizeNationalId(r.nationalId) === cleanStudentNationalId
      );

      return {
        _id: exam._id,
        title: exam.title,
        createdAt: exam.createdAt,
        myResult: myResult || null,
      };
    }).filter((item) => item.myResult !== null);

    return NextResponse.json({ success: true, exams: studentExams });
  } catch (error: any) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در دریافت اطلاعات آزمون‌ها" },
      { status: 500 }
    );
  }
}

// ایجاد آزمون جدید و بارگذاری خودکار اسامی دانش‌آموزان و دروس پیش‌فرض
export async function POST(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const isAdmin = await checkAdminAuth(cookieStore);

    const body = await req.json();
    const { title, grade, subjects, isPublished } = body;

    if (!title || !grade) {
      return NextResponse.json(
        { success: false, error: "عنوان و پایه تحصیلی آزمون الزامی است." },
        { status: 400 }
      );
    }

    const numericGrade = Number(grade);

    // دریافت تمامی دانش‌آموزان جدول لیگ علمی پایه متناسب با پایه‌ی مورد نظر
    const gradeStudents = await GradeStudent.find({ grade: numericGrade });

    // دروس پیش‌فرض در صورت عدم ارسال از فرانت‌اند (با مقادیر دقیق تعداد سوالات و ضرایب)
    const defaultSubjects = subjects && subjects.length > 0 ? subjects : [
      { subjectName: "ریاضی", totalQuestions: 20, coefficient: 2 },
      { subjectName: "علوم", totalQuestions: 20, coefficient: 2 },
      { subjectName: "فارسی", totalQuestions: 20, coefficient: 2 },
      { subjectName: "عربی", totalQuestions: 15, coefficient: 1 },
      { subjectName: "زبان انگلیسی", totalQuestions: 15, coefficient: 1 },
      { subjectName: "مطالعات اجتماعی", totalQuestions: 15, coefficient: 1 },
      { subjectName: "هدیه‌های آسمان", totalQuestions: 15, coefficient: 1 },
    ];

    // ساخت آرایه‌ی اولیه نتیجه‌ها برای هر دانش‌آموز همراه با ساختار نمرات دروس
    const initialResults = gradeStudents.map((gs) => ({
      studentId: gs._id,
      firstName: gs.firstName || "بدون نام",
      lastName: gs.lastName || "",
      nationalId: gs.nationalId && gs.nationalId.trim() !== "" ? gs.nationalId : `unknown_${gs._id}`,
      scores: defaultSubjects.map((sub: any) => ({
        subjectName: sub.subjectName,
        totalQuestions: sub.totalQuestions || 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        percentage: 0,
        coefficient: sub.coefficient || 1,
      })),
      totalPercentage: 0,
      isCompleted: false,
    }));

    const newExam = await Exam.create({
      title,
      grade: numericGrade,
      subjects: defaultSubjects,
      isPublished: isPublished ?? false,
      results: initialResults,
    });

    return NextResponse.json({ success: true, exam: newExam }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در ایجاد آزمون" },
      { status: 500 }
    );
  }
}

// متد PUT برای ذخیره نمرات دانش‌آموز توسط ادمین
export async function PUT(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { examId, studentId, scores } = body;

    if (!examId || !studentId) {
      return NextResponse.json(
        { success: false, error: "شناسه آزمون و دانش‌آموز الزامی است." },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json(
        { success: false, error: "آزمون یافت نشد." },
        { status: 404 }
      );
    }

    // پیدا کردن ایندکس دانش‌آموز در لیست نتایج آزمون
    const studentResultIndex = exam.results.findIndex(
      (r: any) => r.studentId === studentId
    );

    if (studentResultIndex === -1) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموز مورد نظر در این آزمون یافت نشد." },
        { status: 404 }
      );
    }

    // محاسبه درصد کل بر اساس ضرایب
    let totalWeightedPercentage = 0;
    let totalCoefficients = 0;

    const processedScores = scores.map((s: any) => {
      const coeff = Number(s.coefficient) || 1;
      totalWeightedPercentage += Number(s.percentage || 0) * coeff;
      totalCoefficients += coeff;
      return s;
    });

    const finalTotalPercentage =
      totalCoefficients > 0
        ? Number((totalWeightedPercentage / totalCoefficients).toFixed(2))
        : 0;

    // به‌روزرسانی نمرات دانش‌آموز خاص
    exam.results[studentResultIndex].scores = processedScores;
    exam.results[studentResultIndex].totalPercentage = finalTotalPercentage;
    exam.results[studentResultIndex].isCompleted = true;

    await exam.save();

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    console.error("Error updating exam scores:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در بروزرسانی نمرات" },
      { status: 500 }
    );
  }
}

// متد PATCH برای تغییر وضعیت انتشار آزمون
export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { examId, isPublished } = body;

    const exam = await Exam.findByIdAndUpdate(
      examId,
      { isPublished },
      { new: true }
    );

    if (!exam) {
      return NextResponse.json(
        { success: false, error: "آزمون یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    console.error("Error toggling publish:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در تغییر وضعیت انتشار" },
      { status: 500 }
    );
  }
}


