import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import GradeStudent from "./../../../../../models/GradeStudent";

// تابع کمکی برای تبدیل اعداد فارسی/عربی به انگلیسی
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
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token || !token.value) {
      return NextResponse.json({ success: false, error: "دسترسی غیرمجاز." }, { status: 401 });
    }

    const student = await Student.findById(token.value);
    if (!student) return NextResponse.json({ success: false, error: "کاربر یافت نشد." }, { status: 404 });

    // استانداردسازی کد ملی کاربر برای جستجوی دقیق
    const cleanStudentNationalId = normalizeNationalId(student.nationalId);

    // جستجوی رکورد لیگ با روش‌های مختلف
    let gradeRecord = null;
    
    if (student.leagueProfile) {
      gradeRecord = await GradeStudent.findById(student.leagueProfile);
    }

    if (!gradeRecord && cleanStudentNationalId) {
      // جستجو با Regex برای تطبیق هرگونه اختلاف ارقام فارسی/انگلیسی در دیتابیس
      const allGradeStudents = await GradeStudent.find({});
      gradeRecord = allGradeStudents.find(
        (gs) => normalizeNationalId(gs.nationalId) === cleanStudentNationalId
      );

      // اگر پیدا شد، اتصال را برای دفعات بعد تعمیر و ذخیره کن
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
    
    const sameGradeStudents = await GradeStudent.find({ grade });
    sameGradeStudents.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    
    const userIndex = sameGradeStudents.findIndex(
      (s) => normalizeNationalId(s.nationalId) === cleanStudentNationalId
    );
    const gradeRank = userIndex !== -1 ? userIndex + 1 : 1;

    return NextResponse.json({
      success: true,
      data: {
        firstName: student.firstName || gradeRecord?.firstName || "",
        lastName: student.lastName || gradeRecord?.lastName || "",
        grade: grade,
        totalScore: totalScore,
        gradeRank: gradeRank,
        totalGradeStudents: sameGradeStudents.length || 1,
        selectedActivities: gradeRecord?.selectedActivities || [],
      },
    });

  } catch (err: any) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}