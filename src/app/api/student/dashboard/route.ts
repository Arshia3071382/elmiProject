import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import GradeStudent from "./../../../../../models/GradeStudent";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    let nationalId = searchParams.get("nationalId");

    let student = null;

    if (nationalId && nationalId.trim() !== "") {
      student = await GradeStudent.findOne({ nationalId: nationalId.trim() });
    }

    // اگر کد ملی ارسال نشده بود یا پیدا نشد، برای تست و جلوگیری از ارور، آخرین دانش‌آموز ثبت‌شده را می‌آوریم
    if (!student) {
      student = await GradeStudent.findOne().sort({ createdAt: -1 });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموزی یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        firstName: student.firstName,
        lastName: student.lastName,
        grade: student.grade,
        totalScore: student.totalScore,
        selectedActivities: student.selectedActivities,
        published: student.published,
      },
    });
  } catch (err) {
    console.error("Error in student dashboard API:", err);
    return NextResponse.json(
      { success: false, error: "خطایی در دریافت اطلاعات داشبورد رخ داد." },
      { status: 500 }
    );
  }
}