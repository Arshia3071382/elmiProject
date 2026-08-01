import { NextResponse } from "next/server";
// فرض بر این است که اتصال دیتابیس در lib/db.ts قرار دارد
import dbConnect from "./../../../../../lib/dbConnect"; 
import GradeStudent from "./../../../../../models/GradeStudent";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");

  try {
    const filter = grade ? { grade: Number(grade) } : {};
    const students = await GradeStudent.find(filter).sort({ totalScore: -1 });
    return NextResponse.json(students);
  } catch (err) {
    return NextResponse.json({ error: "خطا در گرفتن داده‌ها" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { name, grade } = await req.json();
    const newStudent = await GradeStudent.create({ name, grade, totalScore: 0 });
    return NextResponse.json(newStudent);
  } catch (err) {
    return NextResponse.json({ error: "خطا در ثبت دانش‌آموز" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  try {
    const { id, selectedActivities, addedScore } = await req.json();

    const updated = await GradeStudent.findByIdAndUpdate(
      id,
      {
        // امتیاز جدید را به امتیاز قبلی اضافه می‌کند
        $inc: { totalScore: addedScore }, 
        // فعالیت‌های جدید را جایگزین یا به لیست فعلی اضافه می‌کند
        $set: { selectedActivities: selectedActivities } 
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "خطا در به‌روزرسانی امتیازات" }, { status: 500 });
  }
}