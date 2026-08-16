// src/app/api/student/dashboard/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import GradeStudent from "./../../../../../models/GradeStudent";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز. لطفا وارد شوید." },
        { status: 401 }
      );
    }

    // ۱. پیدا کردن حساب کاربری دانش‌آموز
    const student = await Student.findById(token.value);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموزی با این مشخصات یافت نشد." },
        { status: 404 }
      );
    }

    // ۲. پیدا کردن اطلاعات لیگ از جدول GradeStudent (بر اساس nationalId یا leagueProfile)
    let gradeRecord = null;
    if (student.leagueProfile) {
      gradeRecord = await GradeStudent.findById(student.leagueProfile);
    }
    if (!gradeRecord && student.nationalId) {
      gradeRecord = await GradeStudent.findOne({ nationalId: student.nationalId });
    }

    // امتیاز و پایه (اولویت با اطلاعات ثبت‌شده در جدول لیگ)
    const grade = gradeRecord?.grade || student.grade || 7;
    const totalScore = gradeRecord?.totalScore || student.totalScore || 0;

    // ۳. محاسبه رتبه واقعی در پایه بر اساس امتیازات جدول GradeStudent
    const sameGradeStudents = await GradeStudent.find({ grade });
    // مرتب‌سازی نزولی بر اساس امتیاز
    sameGradeStudents.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    
    // پیدا کردن ایندکس کاربر برای تعیین رتبه
    const userIndex = sameGradeStudents.findIndex(
      (s) => s.nationalId === student.nationalId || (gradeRecord && s._id.toString() === gradeRecord._id.toString())
    );

    const gradeRank = userIndex !== -1 ? userIndex + 1 : 1;
    const totalGradeStudents = sameGradeStudents.length > 0 ? sameGradeStudents.length : 1;

    // ۴. ساختار نهایی پاسخ برای داشبورد
    return NextResponse.json({
      success: true,
      data: {
        firstName: student.firstName || gradeRecord?.firstName || "",
        lastName: student.lastName || gradeRecord?.lastName || "",
        phone: student.phone || "",
        grade: grade,
        totalScore: totalScore,
        gradeRank: gradeRank,
        totalGradeStudents: totalGradeStudents,
        selectedActivities: gradeRecord?.selectedActivities || student.selectedActivities || [],
      },
    });

  } catch (err: any) {
    console.error("Error in student dashboard API:", err);
    return NextResponse.json(
      { success: false, error: err.message || "خطایی در دریافت اطلاعات داشبورد رخ داد." },
      { status: 500 }
    );
  }
}