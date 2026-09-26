import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import GradeStudent from "./../../../../../models/GradeStudent";

export const dynamic = "force-dynamic";

function normalizeNationalId(id: string): string {
  if (!id) return "";
  const persianNumbers = [
    /۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g,
  ];
  const arabicNumbers = [
    /٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g,
  ];
  let normalized = id.trim();
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianNumbers[i], i.toString());
    normalized = normalized.replace(arabicNumbers[i], i.toString());
  }
  return normalized;
}

export async function GET() {
  try {
    await dbConnect();

    const students = await Student.find({}).sort({ createdAt: -1 });

    const allGradeStudents = await GradeStudent.find({});
    const gradeStudentMap = new Map(
      allGradeStudents.map((gs) => [normalizeNationalId(gs.nationalId), gs]),
    );

    const syncPromises: Promise<any>[] = [];

       for (const student of students) {
      const cleanId = normalizeNationalId(student.nationalId);
      const matchedGradeStudent = gradeStudentMap.get(cleanId);

      if (matchedGradeStudent) {
        const needsLeagueLink =
          !student.leagueProfile ||
          student.leagueProfile.toString() !== matchedGradeStudent._id.toString();
        const needsGradeFix = student.grade !== matchedGradeStudent.grade;

        if (needsLeagueLink || needsGradeFix) {
          student.leagueProfile = matchedGradeStudent._id;
          student.grade = matchedGradeStudent.grade;
          syncPromises.push(student.save());
        }

        if (!matchedGradeStudent.studentId) {
          matchedGradeStudent.studentId = student._id;
          syncPromises.push(matchedGradeStudent.save());
        }
      }
    }

    if (syncPromises.length > 0) {
      await Promise.all(syncPromises);
    }

    const result = students.map((s) => ({
      _id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      username: s.username,
      grade: s.grade,
      createdAt: s.createdAt,
      leagueProfile: s.leagueProfile,
    }));

    return NextResponse.json({
      success: true,
      students: result,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, error: "خطا در سرور هنگام دریافت لیست دانش‌آموزان" },
      { status: 500 },
    );
  }
}