import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import Category from "./../../../../../models/Category";
import Course from "./../../../../../models/Course";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    
    const categoriesCount = await Category.countDocuments();
    const coursesCount = await Course.countDocuments();

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

    const elementaryGrades = [2, 3, 4, 5, 6].map((g) => ({
      grade: g,
      count: gradeCounts
        .filter((item) => item._id.grade === g)
        .reduce((acc, curr) => acc + curr.count, 0),
    }));

    const middleGrades = [7, 8, 9, 10].map((g) => {
      const inLeagueCount = gradeCounts
        .filter((item) => item._id.grade === g && item._id.hasLeague)
        .reduce((acc, curr) => acc + curr.count, 0);

      const unlistedCount = gradeCounts
        .filter((item) => item._id.grade === g && !item._id.hasLeague)
        .reduce((acc, curr) => acc + curr.count, 0);

      return {
        grade: g,
        count: inLeagueCount,
        unlistedCount,
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