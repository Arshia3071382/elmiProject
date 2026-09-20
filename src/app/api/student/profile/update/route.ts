import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import GradeStudent from "./../../../../../../models/GradeStudent";
import { jwtVerify } from "jose"; // 🔒 ایمپورت برای اعتبارسنجی توکن امن

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("student_token") || cookieStore.get("token");
    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز. لطفاً دوباره وارد شوید." },
        { status: 401 },
      );
    }

    // 🔒 رمزگشایی و اعتبارسنجی توکن JWT امن
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ||
        "elmi_super_secret_jwt_key_2026_secure_random_string",
    );

    let studentId = "";
    try {
      const { payload } = await jwtVerify(token.value, secret);
      studentId = payload.userId as string;
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: "توکن نامعتبر یا منقضی شده است. لطفاً دوباره وارد شوید.",
        },
        { status: 401 },
      );
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "دانش‌آموز یافت نشد." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { name, avatar } = body;

    const updateData: any = {};
    if (name) {
      updateData.firstName = name.split(" ")[0] || name;
      updateData.lastName = name.split(" ").slice(1).join(" ") || "";
    }
    if (avatar) {
      updateData.avatar = avatar;
    }

    // اگر username خالی بود، مقدار پیش‌فرض بدهیم
    if (!student.username) {
      updateData.username = student.nationalId || `user_${Date.now()}`;
    }

    // استفاده از findByIdAndUpdate برای جلوگیری از خطاهای اعتبارسنجی فیلدهای اجباری دیگر مانند securityPin
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: false } // غیرفعال کردن اعتبارسنجی اجباری کل سند هنگام آپدیت جزئی
    );

    if (updatedStudent && updatedStudent.leagueProfile) {
      const gradeRecord = await GradeStudent.findById(updatedStudent.leagueProfile);
      if (gradeRecord) {
        if (name) {
          gradeRecord.firstName = updatedStudent.firstName;
          gradeRecord.lastName = updatedStudent.lastName;
          await gradeRecord.save();
        }
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
      { status: 500 },
    );
  }
}