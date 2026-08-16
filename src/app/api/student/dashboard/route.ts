// src/app/api/student/dashboard/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student"; // استفاده از مدل اصلی Student که در لاگین استفاده کردید

export async function GET(req: Request) {
  await dbConnect();

  try {
    // خواندن توکن از کوکی
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز. لطفا وارد شوید." },
        { status: 401 }
      );
    }

    // جستجوی دانش‌آموز بر اساس آیدی (_id) ذخیره شده در کوکی
    const student = await Student.findById(token.value);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموزی با این مشخصات یافت نشد." },
        { status: 404 }
      );
    }

    // ساختار داده کاملاً هماهنگ با فرانت‌اند
    return NextResponse.json({
      success: true,
      data: {
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone || "",
        grade: student.grade || 7,
        totalScore: student.totalScore || 0,
        gradeRank: student.gradeRank || 1,
        totalGradeStudents: student.totalGradeStudents || 10,
        selectedActivities: student.selectedActivities || [],
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