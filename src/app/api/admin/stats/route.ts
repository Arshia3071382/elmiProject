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

    // استخراج دانش‌آموزان بر اساس پایه و وضعیت لیگ
    const gradeCounts = await Student.aggregate([
      {
        $group: {
          _id: {
            grade: "$grade",
            hasLeague: { $ne: ["$leagueProfile", null] }
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // مقطع ابتدایی (پایه‌های ۲ تا ۶) - فقط کسانی که داخل لیگ هستند یا پایه معتبر دارند
    const elementaryGrades = [2, 3, 4, 5, 6].map((g) => ({
      grade: g,
      count: gradeCounts
        .filter((item) => item._id.grade === g)
        .reduce((acc, curr) => acc + curr.count, 0),
    }));

    // تفکیک مقطع راهنمایی (پایه‌های ۷ تا ۹) به همراه شناسایی کاربران خارج از لیگ برای پایه ۷
    const middleGrades = [7, 8, 9].map((g) => {
      if (g === 7) {
        // برای پایه هفتم، آنهایی که پروفایل لیگ ندارند را به عنوان ثبت‌نشده جدا می‌کنیم
        const inLeagueCount = gradeCounts
          .filter((item) => item._id.grade === 7 && item._id.hasLeague)
          .reduce((acc, curr) => acc + curr.count, 0);

        const unlistedCount = gradeCounts
          .filter((item) => item._id.grade === 7 && !item._id.hasLeague)
          .reduce((acc, curr) => acc + curr.count, 0);

        return {
          grade: g,
          count: inLeagueCount,
          unlistedCount: unlistedCount, // تعداد ثبت‌نشده‌ها در پایه ۷
        };
      }

      return {
        grade: g,
        count: gradeCounts
          .filter((item) => item._id.grade === g)
          .reduce((acc, curr) => acc + curr.count, 0),
        unlistedCount: 0,
      };
    });

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