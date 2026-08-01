import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import GradeStudent from "../../../../../models/GradeStudent";
import { calculateTotalScore } from "./../../../../../lib/leagueActivities";

// دریافت لیست دانش‌آموزان به تفکیک پایه
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const gradeParam = searchParams.get("grade");

    const query = gradeParam ? { grade: Number(gradeParam) } : {};
    const students = await GradeStudent.find(query).sort({ totalScore: -1 });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت لیست دانش‌آموزان" }, { status: 500 });
  }
}

// ثبت دانش‌آموز جدید
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, grade } = body;

    if (!name || !grade) {
      return NextResponse.json({ error: "نام و پایه تحصیلی الزامی است" }, { status: 400 });
    }

    const newStudent = await GradeStudent.create({
      name,
      grade: Number(grade),
      selectedActivities: [],
      totalScore: 0,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در ایجاد دانش‌آموز" }, { status: 500 });
  }
}

// بروزرسانی فعالیت‌ها و محاسبه مجدد امتیاز
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { studentId, selectedActivities } = body;

    if (!studentId || !Array.isArray(selectedActivities)) {
      return NextResponse.json({ error: "اطلاعات ارسالی معتبر نیست" }, { status: 400 });
    }

    const totalScore = calculateTotalScore(selectedActivities);

    const updatedStudent = await GradeStudent.findByIdAndUpdate(
      studentId,
      { selectedActivities, totalScore },
      { new: true }
    );

    return NextResponse.json(updatedStudent);
  } catch (error) {
    return NextResponse.json({ error: "خطا در به‌روزرسانی امتیازات" }, { status: 500 });
  }
}