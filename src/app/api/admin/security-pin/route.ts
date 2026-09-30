import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Admin from "./../../../../../models/Admin";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { oldPin, newPin, confirmPin } = await req.json();

    const admin = await Admin.findOne({ role: "admin" }).sort({ createdAt: 1, _id: 1 });
    if (!admin) {
      return NextResponse.json({ success: false, message: "حساب ادمین یافت نشد." }, { status: 404 });
    }

    const pinRegex = /^\d{8}$/;

    // حالت اول: اگر هنوز پین‌کدی ثبت نشده باشد (برای اولین بار)
    if (!admin.securityPin || admin.securityPin.trim() === "") {
      if (!newPin || !confirmPin) {
        return NextResponse.json({ success: false, message: "لطفاً کد امنیتی جدید و تکرار آن را وارد کنید." }, { status: 400 });
      }
      if (!pinRegex.test(newPin)) {
        return NextResponse.json({ success: false, message: "کد امنیتی باید دقیقاً ۸ رقم و فقط شامل عدد باشد." }, { status: 400 });
      }
      if (newPin !== confirmPin) {
        return NextResponse.json({ success: false, message: "کد امنیتی جدید و تکرار آن مطابقت ندارند." }, { status: 400 });
      }

      admin.securityPin = newPin;
      await admin.save();
      return NextResponse.json({ success: true, message: "کد امنیتی ۸ رقمی با موفقیت ثبت و فعال شد." });
    }

    // حالت دوم: اگر پین‌کد از قبل وجود داشته باشد (تغییر پین)
    if (!oldPin || !newPin || !confirmPin) {
      return NextResponse.json({ success: false, message: "لطفاً تمام فیلدها را پر کنید." }, { status: 400 });
    }

    if (oldPin !== admin.securityPin) {
      return NextResponse.json({ success: false, message: "کد امنیتی فعلی اشتباه است." }, { status: 401 });
    }

    if (!pinRegex.test(newPin)) {
      return NextResponse.json({ success: false, message: "کد امنیتی جدید باید دقیقاً ۸ رقم و فقط شامل عدد باشد." }, { status: 400 });
    }

    if (newPin !== confirmPin) {
      return NextResponse.json({ success: false, message: "کد امنیتی جدید و تکرار آن مطابقت ندارند." }, { status: 400 });
    }

    admin.securityPin = newPin;
    await admin.save();

    return NextResponse.json({ success: true, message: "کد امنیتی با موفقیت تغییر کرد." });
  } catch (error) {
    console.error("Security pin error:", error);
    return NextResponse.json({ success: false, message: "خطای سرور رخ داد." }, { status: 500 });
  }
}