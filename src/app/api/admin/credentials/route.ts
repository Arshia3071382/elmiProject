import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Admin from "./../../../../../models/Admin";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { oldUsername, oldPassword, newUsername, newPassword } = await req.json();

    // بررسی پر بودن فیلدها
    if (!oldUsername || !oldPassword || !newUsername || !newPassword) {
      return NextResponse.json(
        { success: false, message: "لطفاً تمام فیلدها را پر کنید." },
        { status: 400 }
      );
    }

    // اعتبارسنجی رمز عبور جدید: ۶ تا ۸ کاراکتر، شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور جدید باید بین ۶ تا ۸ کاراکتر و شامل حروف بزرگ و کوچک انگلیسی و عدد باشد.",
        },
        { status: 400 }
      );
    }

    // پیدا کردن ادمین با نام کاربری قبلی
    const admin = await Admin.findOne({ username: oldUsername });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "نام کاربری یا رمز عبور فعلی اشتباه است." },
        { status: 401 }
      );
    }

    // بررسی درستی رمز عبور قبلی (پشتیبانی از رمز هش شده یا ساده)
    let isPasswordValid = false;
    if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
      isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    } else {
      isPasswordValid = admin.password === oldPassword;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "نام کاربری یا رمز عبور فعلی اشتباه است." },
        { status: 401 }
      );
    }

    // بررسی اینکه آیا نام کاربری جدید توسط ادمین دیگری استفاده نشده باشد
    if (newUsername !== oldUsername) {
      const existingAdmin = await Admin.findOne({ username: newUsername });
      if (existingAdmin) {
        return NextResponse.json(
          { success: false, message: "این نام کاربری جدید قبلاً ثبت شده است." },
          { status: 400 }
        );
      }
    }

    // هش کردن رمز جدید (در صورت استفاده از bcrypt) یا ذخیره به صورت متنی
    let finalNewPassword = newPassword;
    if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
      const salt = await bcrypt.genSalt(10);
      finalNewPassword = await bcrypt.hash(newPassword, salt);
    }

    // به‌روزرسانی اطلاعات
    admin.username = newUsername;
    admin.password = finalNewPassword;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "نام کاربری و رمز عبور با موفقیت تغییر کرد.",
    });
  } catch (error) {
    console.error("Error updating admin credentials:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور رخ داد." },
      { status: 500 }
    );
  }
}