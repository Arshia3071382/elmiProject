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
        { success: false, message: "دسترسی غیرمجاز. لطفاً دوباره وارد شوید." },
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

    const body = await req.json();
    const { name, avatar } = body;

    if (name) {
      student.firstName = name.split(" ")[0] || name;
      student.lastName = name.split(" ").slice(1).join(" ") || "";
    }
    if (avatar) {
      student.avatar = avatar;
    }

    // جلوگیری از خطای خالی بودن username در صورت اجباری بودن در مدل
    if (!student.username) {
      student.username = student.nationalId || `user_${Date.now()}`;
    }

    await student.save();

    if (student.leagueProfile) {
      const gradeRecord = await GradeStudent.findById(student.leagueProfile);
      if (gradeRecord) {
        if (name) {
          gradeRecord.firstName = student.firstName;
          gradeRecord.lastName = student.lastName;
        }
        await gradeRecord.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "پروفایل با موفقیت به‌روزرسانی شد.",
    });
  } catch (err: any) {
    console.error("Profile Update Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "خطای سرور رخ داد." },
      { status: 500 }
    );
  }
}