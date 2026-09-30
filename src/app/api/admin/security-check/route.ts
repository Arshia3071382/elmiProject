import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Admin from "./../../../../../models/Admin";

let failedAttempts = 0;
let lockoutUntil: number | null = null;

export async function POST(req: Request) {
  try {
    const { securityCode } = await req.json();
    const currentTime = Date.now();

    if (lockoutUntil && currentTime < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - currentTime) / 60000);
      return NextResponse.json(
        { success: false, message: `دسترسی مسدود است. لطفاً ${remainingMinutes} دقیقه دیگر تلاش کنید.` },
        { status: 429 }
      );
    }

    if (lockoutUntil && currentTime >= lockoutUntil) {
      failedAttempts = 0;
      lockoutUntil = null;
    }

    await dbConnect();
    const admin = await Admin.findOne({ role: "admin" }).sort({ createdAt: 1, _id: 1 });

    if (!admin || !admin.securityPin || admin.securityPin.trim() === "") {
      return NextResponse.json({ success: false, message: "هنوز کد امنیتی تنظیم نشده است. لطفاً از طریق تنظیمات پنل اقدام کنید." }, { status: 400 });
    }

    if (admin.securityPin === securityCode) {
      failedAttempts = 0;
      lockoutUntil = null;
      return NextResponse.json({ success: true, message: "موفقیت‌آمیز بود." });
    } else {
      failedAttempts += 1;
      if (failedAttempts >= 3) {
        lockoutUntil = Date.now() + 10 * 60 * 1000;
        failedAttempts = 0;
        return NextResponse.json(
          { success: false, message: "کد امنیتی اشتباه است. به دلیل ۳ بار اشتباه متوالی، دسترسی به مدت ۱۰ دقیقه قفل شد." },
          { status: 429 }
        );
      }

      const remainingTries = 3 - failedAttempts;
      return NextResponse.json(
        { success: false, message: `کد امنیتی اشتباه است. ${remainingTries} فرصت دیگر باقی مانده است.` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Security check error:", error);
    return NextResponse.json({ success: false, message: "خطای سرور" }, { status: 500 });
  }
}