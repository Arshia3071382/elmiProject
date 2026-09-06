import { NextResponse } from "next/server";
import { dbConnect } from "./../../../../lib/dbConnect";
import GradeStudent from "./../../../../models/GradeStudent";
import { EliteStudent } from "./../../../../models/EliteStudent";
import LeagueSetting from "./../../../../models/LeagueSetting";

// GET: دریافت لیست دانش‌آموزان به تفکیک دسته‌بندی و مقطع
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "elementary";
    const isAdmin = searchParams.get("admin") === "true";

    const targetGrades = category === "elementary" ? [2, 3, 4, 5, 6] : [7, 8, 9];

    // دریافت تنظیمات نمایش جدول
    let setting = await LeagueSetting.findOne();
    if (!setting) {
      setting = await LeagueSetting.create({ elementaryVisible: true, highschoolVisible: true });
    }

    const isVisible = category === "elementary" ? setting.elementaryVisible : setting.highschoolVisible;

    if (isAdmin) {
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

      return NextResponse.json({ students: result, isVisible }, { status: 200 });
    } else {
      // اگر جدول توسط ادمین غیرفعال شده باشد
      if (!isVisible) {
        return NextResponse.json({ students: [], isVisible: false }, { status: 200 });
      }

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

      return NextResponse.json({ students: result, isVisible: true }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 });
  }
}

// PATCH: تایید نهایی انتشار یا تغییر وضعیت نمایش
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { category, action } = body;

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    let setting = await LeagueSetting.findOne();
    if (!setting) {
      setting = new LeagueSetting();
    }

    // اگر درخواست فقط تغییر وضعیت عدم نمایش (hide) باشد
    if (action === "hide") {
      if (category === "elementary") {
        setting.elementaryVisible = false;
      } else {
        setting.highschoolVisible = false;
      }
      await setting.save();
      return NextResponse.json({ message: "Hidden successfully" }, { status: 200 });
    }

    // اگر درخواست «نمایش» یا «تایید نهایی / انتشار» باشد
    // هم وضعیت نمایش را روشن می‌کنیم و هم ۱۵ نفر برتر با بیشترین امتیاز را محاسبه و ذخیره می‌کنیم
    if (action === "show" || action === "publish" || !action) {
      if (category === "elementary") {
        setting.elementaryVisible = true;
      } else {
        setting.highschoolVisible = true;
      }
      await setting.save();

      const targetGrades = category === "elementary" ? [2, 3, 4, 5, 6] : [7, 8, 9];

      // استخراج ۱۵ نفر برتر بر اساس بیشترین امتیاز
      const topStudents = await GradeStudent.find({ grade: { $in: targetGrades } })
        .sort({ totalScore: -1 })
        .limit(15);

      await EliteStudent.deleteMany({ category });

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

      return NextResponse.json({ message: "Table published and visible successfully" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
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
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}