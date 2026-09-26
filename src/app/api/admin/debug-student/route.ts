import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Student from "./../../../../../models/Student";
import GradeStudent from "./../../../../../models/GradeStudent";

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
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const nationalId = searchParams.get("nationalId");
    const name = searchParams.get("name");

    if (!nationalId && !name) {
      return NextResponse.json(
        { success: false, error: "پارامتر nationalId یا name الزامی است" },
        { status: 400 }
      );
    }

    let student = null;
    if (nationalId) {
      const clean = normalizeNationalId(nationalId);
      student = await Student.findOne({ nationalId: clean });
      if (!student) {
        const all = await Student.find({});
        student = all.find((s) => normalizeNationalId(s.nationalId) === clean) || null;
      }
    } else if (name) {
      student = await Student.findOne({
        $or: [
          { firstName: { $regex: name, $options: "i" } },
          { lastName: { $regex: name, $options: "i" } },
        ],
      });
    }

    let gradeStudent = null;
    if (student) {
      const cleanId = normalizeNationalId(student.nationalId);
      gradeStudent = await GradeStudent.findOne({ nationalId: cleanId });
      if (!gradeStudent) {
        const allGs = await GradeStudent.find({});
        gradeStudent =
          allGs.find((gs) => normalizeNationalId(gs.nationalId) === cleanId) || null;
      }
    }

    return NextResponse.json({
      success: true,
      student: student
        ? {
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            nationalId: student.nationalId,
            nationalId_normalized: normalizeNationalId(student.nationalId),
            grade: student.grade,
            leagueProfile: student.leagueProfile,
            createdAt: student.createdAt,
          }
        : null,
      gradeStudent: gradeStudent
        ? {
            _id: gradeStudent._id,
            firstName: gradeStudent.firstName,
            lastName: gradeStudent.lastName,
            nationalId: gradeStudent.nationalId,
            nationalId_normalized: normalizeNationalId(gradeStudent.nationalId),
            grade: gradeStudent.grade,
            studentId: gradeStudent.studentId,
          }
        : null,
      diagnosis: {
        studentFound: Boolean(student),
        gradeStudentFound: Boolean(gradeStudent),
        nationalIdsMatch:
          student && gradeStudent
            ? normalizeNationalId(student.nationalId) === normalizeNationalId(gradeStudent.nationalId)
            : null,
        leagueProfileIsLinked: student ? Boolean(student.leagueProfile) : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}