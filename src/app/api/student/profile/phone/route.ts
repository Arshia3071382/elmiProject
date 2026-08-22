import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز." },
        { status: 401 }
      );
    }

    const student = await Student.findById(token.value);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "دانش‌آموز یافت نشد." },
        { status: 404 }
      );
    }

    const { phone } = await req.json();

    if (!phone || !/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل معتبر نیست." },
        { status: 400 }
      );
    }

    student.phone = phone;
    if (!student.username) {
      student.username = student.nationalId || `user_${Date.now()}`;
    }
    await student.save();

    if (student.leagueProfile) {
      const gradeRecord = await GradeStudent.findById(student.leagueProfile);
      if (gradeRecord) {
        gradeRecord.phone = phone;
        await gradeRecord.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "شماره موبایل با موفقیت تغییر کرد.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "خطای سرور." },
      { status: 500 }
    );
  }
}