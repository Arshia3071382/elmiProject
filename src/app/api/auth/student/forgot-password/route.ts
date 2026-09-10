import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { action, identifier, securityQuestion, securityAnswer, securityCode, playerCode, newPassword } = body;

    if (!action || !identifier) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ارسالی ناقص است." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().replace(/\D/g, "");
    
    const student = await Student.findOne({
      $or: [
        { nationalId: identifier.trim() },
        { phone: cleanIdentifier },
        { username: identifier.trim() }
      ]
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "کاربری با این مشخصات یافت نشد." },
        { status: 404 }
      );
    }

    if (action === "checkUser") {
      return NextResponse.json({ 
        success: true, 
        message: "کاربر یافت شد.",
        securityQuestion: student.securityQuestion 
      });
    }

    if (action === "verifyAnswer" || action === "resetPassword") {
      const sCode = (securityCode || "").trim();
      const pCode = (playerCode || "").trim().toLowerCase();
      
      let rawAns = (securityAnswer || "").trim();
      
      let derivedSCode = sCode;
      let derivedPCode = pCode;
      
      if (!sCode && rawAns) {
        const match = rawAns.match(/^(\d{6})[\s-]?(.+)$/);
        if (match) {
          derivedSCode = match[1];
          derivedPCode = match[2].trim().toLowerCase();
        }
      }

      const combinedWithHyphen = derivedSCode && derivedPCode ? `${derivedSCode}-${derivedPCode}` : "";
      const combined = derivedSCode && derivedPCode ? `${derivedSCode}${derivedPCode}` : rawAns.toLowerCase();
      const combinedWithSpace = derivedSCode && derivedPCode ? `${derivedSCode} ${derivedPCode}` : rawAns;

      let possiblePlaintexts: string[] = [
        combinedWithHyphen,
        combined,
        combinedWithSpace,
        rawAns,
        rawAns.toLowerCase(),
        rawAns.replace(/\s+/g, ""),
        sCode, 
        pCode
      ].filter(Boolean);

      possiblePlaintexts = Array.from(new Set(possiblePlaintexts));

      if (!student.securityAnswerHash) {
        return NextResponse.json(
          { success: false, message: "اطلاعات امنیتی برای این کاربر ثبت نشده است." },
          { status: 400 }
        );
      }

      let isAnswerValid = false;
      for (const text of possiblePlaintexts) {
        const match = await bcrypt.compare(text, student.securityAnswerHash);
        if (match) {
          isAnswerValid = true;
          break;
        }
      }

      if (!isAnswerValid) {
        return NextResponse.json(
          { success: false, message: "اطلاعات امنیتی وارد شده نادرست است." },
          { status: 400 }
        );
      }

      if (action === "verifyAnswer") {
        return NextResponse.json({ success: true, message: "پاسخ امنیتی تایید شد." });
      }

      if (!newPassword) {
        return NextResponse.json(
          { success: false, message: "رمز عبور جدید وارد نشده است." },
          { status: 400 }
        );
      }

      // قانون جدید رمز عبور: ۶ تا ۸ کاراکتر شامل حروف بزرگ، کوچک و عدد
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json(
          { 
            success: false, 
            message: "رمز عبور باید بین ۶ تا ۸ کاراکتر و شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد انگلیسی باشد." 
          },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(12);
      student.passwordHash = await bcrypt.hash(newPassword, salt);
      await student.save();

      return NextResponse.json({
        success: true,
        message: "رمز عبور با موفقیت تغییر یافت."
      });
    }

    return NextResponse.json(
      { success: false, message: "عملیات نامعتبر است." },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در پردازش درخواست." },
      { status: 500 }
    );
  }
}