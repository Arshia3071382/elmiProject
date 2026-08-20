import { NextResponse } from "next/server";
import { dbConnect } from "./../../../../lib/dbConnect";
import GradeStudent from "./../../../../models/GradeStudent";
import { EliteStudent } from "./../../../../models/EliteStudent";

// GET: دریافت لیست دانش‌آموزان به تفکیک دسته‌بندی و مقطع
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "elementary";
    const isAdmin = searchParams.get("admin") === "true";

    // تفکیک دقیق پایه‌ها بر اساس دسته
    // ابتدایی: 2 تا 6 | راهنمایی: 7 تا 9
    const targetGrades = category === "elementary" ? [2, 3, 4, 5, 6] : [7, 8, 9];

    if (isAdmin) {
      // برای ادمین: تمام دانش‌آموزان این پایه‌ها را می‌آوریم
      const students = await GradeStudent.find({ grade: { $in: targetGrades } })
        .sort({ totalScore: -1 });

      const eliteRecords = await EliteStudent.find({ category, isPublished: true });
      const eliteIds = new Set(eliteRecords.map((e: any) => e.studentId?.toString()));

      const result = students.map((student: any) => ({
        _id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        grade: `${student.grade}`,
        score: student.totalScore,
        category,
        isPublished: eliteIds.has(student._id.toString()),
      }));

      return NextResponse.json(result, { status: 200 });
    } else {
      // برای کاربران عادی: فقط 20 نفر برتر منتشر شده همان مقطع
      const eliteRecords = await EliteStudent.find({ category, isPublished: true })
        .sort({ score: -1 })
        .limit(20);

      const result = eliteRecords.map((item: any) => ({
        _id: item._id,
        name: item.name,
        grade: item.grade,
        score: item.score,
        category,
        isPublished: true,
      }));

      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 });
  }
}

// POST: خالی یا فرمت پایه
export async function POST(request: Request) {
  try {
    await dbConnect();
    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Insertion failed" }, { status: 500 });
  }
}

// PATCH: تایید نهایی و انتشار 20 نفر برتر مقطع انتخابی (ابتدایی یا راهنمایی به صورت جداگانه)
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const targetGrades = category === "elementary" ? [2, 3, 4, 5, 6] : [7, 8, 9];

    // استخراج 20 نفر برتر از پایه‌های همان مقطع
    const topStudents = await GradeStudent.find({ grade: { $in: targetGrades } })
      .sort({ totalScore: -1 })
      .limit(20);

    // پاک کردن رکوردهای منتشر شده قبلی فقط برای همین مقطع
    await EliteStudent.deleteMany({ category });

    // ثبت 20 نفر برتر جدید این مقطع
    const eliteDocs = topStudents.map((student: any) => ({
      studentId: student._id,
      name: `${student.firstName} ${student.lastName}`,
      grade: `${student.grade}`,
      score: student.totalScore,
      category,
      isPublished: true,
    }));

    if (eliteDocs.length > 0) {
      await EliteStudent.insertMany(eliteDocs);
    }

    return NextResponse.json({ message: "Table published successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}

// DELETE: حذف از لیست نخبگان
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await EliteStudent.findOneAndDelete({ studentId: id });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}