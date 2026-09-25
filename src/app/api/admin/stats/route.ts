import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import Category from "./../../../../../models/Category";
import Course from "./../../../../../models/Course";

export async function GET() {
  try {
    await dbConnect();
    
    const categoriesCount = await Category.countDocuments();
    const coursesCount = await Course.countDocuments();

    // استخراج تعداد دانش‌آموزان به تفکیک پایه از مدل Student
    const gradeCounts = await Student.aggregate([
      {
        $group: {
          _id: "$grade",
          count: { $sum: 1 },
        },
      },
    ]);

    // تفکیک مقطع ابتدایی (پایه‌های ۲ تا ۶)
    const elementaryGrades = [2, 3, 4, 5, 6].map((g) => ({
      grade: g,
      count: gradeCounts.find((item) => item._id === g)?.count || 0,
    }));

    // تفکیک مقطع راهنمایی (پایه‌های ۷ تا ۹)
    const middleGrades = [7, 8, 9].map((g) => ({
      grade: g,
      count: gradeCounts.find((item) => item._id === g)?.count || 0,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        categoriesCount,
        coursesCount,
        averageCourses: categoriesCount > 0 ? Number((coursesCount / categoriesCount).toFixed(1)) : 0,
        elementaryGrades,
        middleGrades,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}