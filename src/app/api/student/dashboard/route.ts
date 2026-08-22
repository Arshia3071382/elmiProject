import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import GradeStudent from "./../../../../../models/GradeStudent";
import LeagueSetting from "./../../../../../models/LeagueSetting";
import { EliteStudent } from "./../../../../../models/EliteStudent";

function normalizeNationalId(id: string): string {
  if (!id) return "";
  const persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  const arabicNumbers = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];

  let normalized = id.trim();
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianNumbers[i], i.toString());
    normalized = normalized.replace(arabicNumbers[i], i.toString());
  }
  return normalized;
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryNationalId = searchParams.get("nationalId");

    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    let student = null;

    // ۱. پیدا کردن دانش‌آموز از طریق کوکی معتبر
    if (token && token.value) {
      try {
        student = await Student.findById(token.value);
      } catch (e) {
        // اگر توکن معتبر نبود ادامه می‌دهیم
      }
    }

    // ۲. پشتیبانی از جستجو با کد ملی ارسالی از کوئری پارامتر
    if (!student && queryNationalId) {
      const cleanQueryId = normalizeNationalId(queryNationalId);
      const allStudents = await Student.find({});
      student = allStudents.find(
        (s) => normalizeNationalId(s.nationalId) === cleanQueryId,
      );
    }

    if (!student) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز یا کاربر یافت نشد." },
        { status: 401 },
      );
    }

    const cleanStudentNationalId = normalizeNationalId(student.nationalId);

    // ۳. پیدا کردن یا متصل کردن رکورد لیگ پایه (GradeStudent)
    let gradeRecord = null;
    if (student.leagueProfile) {
      gradeRecord = await GradeStudent.findById(student.leagueProfile);
    }

    if (!gradeRecord && cleanStudentNationalId) {
      const allGradeStudents = await GradeStudent.find({});
      gradeRecord = allGradeStudents.find(
        (gs) => normalizeNationalId(gs.nationalId) === cleanStudentNationalId,
      );

      if (gradeRecord) {
        student.leagueProfile = gradeRecord._id;
        await student.save();
        if (!gradeRecord.studentId) {
          gradeRecord.studentId = student._id;
          await gradeRecord.save();
        }
      }
    }

    const grade = gradeRecord?.grade || student.grade || 6;
    const totalScore = gradeRecord?.totalScore || 0;

    // ۴. محاسبه دقیق رتبه در لیگ پایه
  // ۴. محاسبه دقیق رتبه در لیگ پایه بر اساس امتیاز
    const sameGradeStudents = await GradeStudent.find({ grade }).sort({ totalScore: -1 });
    
    let userIndex = -1;

    // الف: جستجو با ObjectId رکورد لیگ
    if (gradeRecord && gradeRecord._id) {
      userIndex = sameGradeStudents.findIndex(
        (s) => s._id.toString() === gradeRecord._id.toString()
      );
    }

    // ب: اگر پیدا نشد، جستجو با اتصال به studentId
    if (userIndex === -1 && student._id) {
      userIndex = sameGradeStudents.findIndex(
        (s) => s.studentId && s.studentId.toString() === student._id.toString()
      );
    }
    
    // ج: اگر باز هم پیدا نشد، جستجو با کد ملی نرمال‌شده
    if (userIndex === -1 && cleanStudentNationalId) {
      userIndex = sameGradeStudents.findIndex(
        (s) => normalizeNationalId(s.nationalId) === cleanStudentNationalId
      );
    }
    
    const gradeRank = userIndex !== -1 ? userIndex + 1 : 1;

    // پیدا کردن نفر بالایی و پایینی برای رادار رقابتی
    let higherStudent = null;
    let lowerStudent = null;

    if (userIndex !== -1) {
      // نفر بالایی (index - 1) - یعنی رتبه بهتر (امتیاز بالاتر)
      if (userIndex > 0) {
        const higher = sameGradeStudents[userIndex - 1];
        higherStudent = {
          name: `${higher.firstName || ""} ${higher.lastName || ""}`.trim() || "دانش‌آموز برتر",
          score: higher.totalScore || 0,
        };
      }
      
      // نفر پایینی (index + 1) - یعنی رتبه پایین‌تر (امتیاز کمتر)
      if (userIndex < sameGradeStudents.length - 1) {
        const lower = sameGradeStudents[userIndex + 1];
        lowerStudent = {
          name: `${lower.firstName || ""} ${lower.lastName || ""}`.trim() || "دانش‌آموز",
          score: lower.totalScore || 0,
        };
      }
    }

    // ۵. استخراج دقیق نام و نام خانوادگی
    const firstName = student.firstName || gradeRecord?.firstName || "";
    const lastName = student.lastName || gradeRecord?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "دانش‌آموز";

    // ۶. محاسبه رتبه و امتیاز در لیگ نخبگان (EliteStudent)
    let eliteLeagueData = null;
    try {
      const eliteRecord = await EliteStudent.findOne({
        name: { $regex: new RegExp(fullName, "i") },
        isPublished: true,
      });

      if (eliteRecord) {
        const sameCategoryElite = await EliteStudent.find({
          category: eliteRecord.category,
          isPublished: true,
        }).sort({ score: -1 });

        const eliteIndex = sameCategoryElite.findIndex(
          (e) => e._id.toString() === eliteRecord._id.toString(),
        );

        const eliteRank = eliteIndex !== -1 ? eliteIndex + 1 : 0;

        eliteLeagueData = {
          score: eliteRecord.score,
          rank: eliteRank,
          category: eliteRecord.category,
        };
      }
    } catch (e) {
      console.error("Elite League fetch error:", e);
    }

    // ۷. دریافت تاریخ آخرین به‌روزرسانی لیگ
    const setting = await LeagueSetting.findOne();
    const lastLeagueUpdate = setting?.lastUpdate
      ? new Date(setting.lastUpdate).toLocaleDateString("fa-IR")
      : "نامشخص";

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: fullName,
          grade: grade,
          level: "فعال",
          totalScore: totalScore,
          scoreToNextLevel: 100 - (totalScore % 100),
        },
        gradeLeague: {
          score: totalScore,
          rank: gradeRank,
          totalStudents: sameGradeStudents.length || 1,
          scientificLevelTitle: `پایه ${grade}`,
          higherStudent: higherStudent, // ارسال داده نفر بالا
          lowerStudent: lowerStudent, // ارسال داده نفر پایین
        },
        eliteLeague: eliteLeagueData,
        badges: [
          { title: "عضو فعال", icon: "⭐" },
          { title: "پیشگام", icon: "🚀" },
        ],
        recentActivities:
          gradeRecord?.selectedActivities?.map((act: string) => ({
            title: act,
            scoreChange: 10,
            date: "اخیر",
          })) || [],
        lastLeagueUpdate: lastLeagueUpdate,
      },
    });
  } catch (err: any) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
