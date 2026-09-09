import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";
import bcrypt from "bcryptjs";

// تبدیل ارقام فارسی و عربی به انگلیسی جهت اعتبارسنجی دقیق
const toEnglishDigits = (str: string) => {
  return str
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
};

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ارسالی نامعتبر است." },
        { status: 400 }
      );
    }

    const { action, nationalId, answer, newPassword } = body;
    const cleanNationalId = toEnglishDigits(String(nationalId || "")).trim();

    // ۱. دریافت سوال امنیتی با کد ملی
    if (action === "getQuestion") {
      if (!cleanNationalId) {
        return NextResponse.json(
          { success: false, message: "کد ملی الزامی است." },
          { status: 400 }
        );
      }

      const student = await Student.findOne({ nationalId: cleanNationalId });

      if (!student || !student.securityQuestion) {
        return NextResponse.json(
          { success: false, message: "دانش‌آموزی با این کد ملی یا سوال امنیتی یافت نشد." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, question: student.securityQuestion });
    }

    // ۲. بررسی پاسخ عددی
    if (action === "verifyAnswer") {
      const student = await Student.findOne({ nationalId: cleanNationalId });

      if (!student || !student.securityAnswer) {
        return NextResponse.json(
          { success: false, message: "اطلاعات دانش‌آموز یافت نشد." },
          { status: 404 }
        );
      }

      const savedAnswer = toEnglishDigits(String(student.securityAnswer)).trim();
      const inputAnswer = toEnglishDigits(String(answer || "")).trim();

      if (savedAnswer !== inputAnswer) {
        return NextResponse.json(
          { success: false, message: "پاسخ عددی وارد شده اشتباه است." },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // ۳. تغییر رمز عبور
    if (action === "resetPassword") {
      const student = await Student.findOne({ nationalId: cleanNationalId });

      if (!student || !student.securityAnswer) {
        return NextResponse.json(
          { success: false, message: "دانش‌آموز یافت نشد." },
          { status: 404 }
        );
      }

      const savedAnswer = toEnglishDigits(String(student.securityAnswer)).trim();
      const inputAnswer = toEnglishDigits(String(answer || "")).trim();

      if (savedAnswer !== inputAnswer) {
        return NextResponse.json(
          { success: false, message: "اعتبارسنجی پاسخ ناموفق بود." },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      student.password = hashedPassword;
      student.passwordHash = hashedPassword;
      await student.save();

      return NextResponse.json({
        success: true,
        message: "رمز عبور با موفقیت تغییر یافت.",
      });
    }

    return NextResponse.json({ success: false, message: "درخواست نامعتبر است." }, { status: 400 });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "خطای سرور رخ داده است." }, { status: 500 });
  }
}