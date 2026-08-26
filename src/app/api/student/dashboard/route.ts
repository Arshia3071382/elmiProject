import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import GradeStudent from "./../../../../../models/GradeStudent";
import LeagueSetting from "./../../../../../models/LeagueSetting";
import { EliteStudent } from "./../../../../../models/EliteStudent";
import { jwtVerify } from "jose"; 

function normalizeNationalId(id: string): string {
  if (!id) return "";
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

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
    // 🔒 پوشش کامل تمام نام‌های احتمالی کوکی دانش‌آموز
    const token = 
      cookieStore.get("token") || 
      cookieStore.get("studentToken") || 
      cookieStore.get("student_token");

    let student = null;

    // ۱. پیدا کردن دانش‌آموز از طریق توکن JWT امن
    if (token && token.value) {
      try {
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
        );
        const { payload } = await jwtVerify(token.value, secret);
        const studentId = (payload.userId || payload.id || payload.sub) as string;
        
        if (studentId) {
          student = await Student.findById(studentId);
        }
      } catch (e) {
        // اگر توکن به صورت کد ملی یا آیدی خام در کوکی ذخیره شده بود
        const rawTokenVal = token.value;
        if (rawTokenVal.length === 24) {
          student = await Student.findById(rawTokenVal);
        } else {
          student = await Student.findOne({ nationalId: normalizeNationalId(rawTokenVal) });
        }
      }
    }

    // ۲. پشتیبانی از جستجو با کد ملی ارسالی از کوئری پارامتر
    if (!student && queryNationalId) {
      const cleanQueryId = normalizeNationalId(queryNationalId);
      student = await Student.findOne({ nationalId: cleanQueryId });
      if (!student) {
        const allStudents = await Student.find({});
        student = allStudents.find(
          (s) => normalizeNationalId(s.nationalId) === cleanQueryId,
        );
      }
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
      gradeRecord = await GradeStudent.findOne({ nationalId: cleanStudentNationalId });
      if (!gradeRecord) {
        const allGradeStudents = await GradeStudent.find({});
        gradeRecord = allGradeStudents.find(
          (gs) => normalizeNationalId(gs.nationalId) === cleanStudentNationalId,
        );
      }

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

    // ۴. محاسبه دقیق رتبه در لیگ پایه بر اساس امتیاز
    const sameGradeStudents = await GradeStudent.find({ grade }).sort({ totalScore: -1 });
    
    let userIndex = -1;

    if (gradeRecord && gradeRecord._id) {
      userIndex = sameGradeStudents.findIndex(
        (s) => s._id.toString() === gradeRecord._id.toString()
      );
    }

    if (userIndex === -1 && student._id) {
      userIndex = sameGradeStudents.findIndex(
        (s) => s.studentId && s.studentId.toString() === student._id.toString()
      );
    }
    
    if (userIndex === -1 && cleanStudentNationalId) {
      userIndex = sameGradeStudents.findIndex(
        (s) => normalizeNationalId(s.nationalId) === cleanStudentNationalId
      );
    }
    
    const gradeRank = userIndex !== -1 ? userIndex + 1 : 1;

    let higherStudent = null;
    let lowerStudent = null;

    if (userIndex !== -1) {
      if (userIndex > 0) {
        const higher = sameGradeStudents[userIndex - 1];
        higherStudent = {
          name: `${higher.firstName || ""} ${higher.lastName || ""}`.trim() || "دانش‌آموز برتر",
          score: higher.totalScore || 0,
        };
      }
      
      if (userIndex < sameGradeStudents.length - 1) {
        const lower = sameGradeStudents[userIndex + 1];
        lowerStudent = {
          name: `${lower.firstName || ""} ${lower.lastName || ""}`.trim() || "دانش‌آموز",
          score: lower.totalScore || 0,
        };
      }
    }

    const firstName = student.firstName || gradeRecord?.firstName || "";
    const lastName = student.lastName || gradeRecord?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "دانش‌آموز";

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
          avatar: student.avatar && student.avatar.startsWith("/") 
            ? student.avatar 
            : "/image/profile/p2.png",
        },
        gradeLeague: {
          score: totalScore,
          rank: gradeRank,
          totalStudents: sameGradeStudents.length || 1,
          scientificLevelTitle: `پایه ${grade}`,
          higherStudent: higherStudent, 
          lowerStudent: lowerStudent, 
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