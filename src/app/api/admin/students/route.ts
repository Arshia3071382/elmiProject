import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";

export async function GET() {
  try {
    await dbConnect();

    // دریافت لیست تمامی دانش‌آموزان به همراه وضعیت پروفایل لیگ
    const students = await Student.find({})
      .select("firstName lastName username grade createdAt leagueProfile")
      .sort({ createdAt: -1 }); // نمایش جدیدترین ثبت‌نام‌ها در ابتدا

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, error: "خطا در سرور هنگام دریافت لیست دانش‌آموزان" },
      { status: 500 }
    );
  }
}