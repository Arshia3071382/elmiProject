import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Admin from "./../../../../../models/Admin";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";
import Student from "./../../../../../models/Student";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// لایه محافظتی Rate Limiting در حافظه سرور (بدون نیاز به دیتابیس)
const loginAttemptsMap = new Map<string, { count: number; lockoutUntil: number }>();

export async function POST(req: Request) {
  try {
    // استخراج IP کاربر برای محدودسازی نرخ درخواست (پشتیبانی بهتر از پروکسی‌ها)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : (req.headers.get("x-real-ip") || "127.0.0.1");
    const now = Date.now();
    const record = loginAttemptsMap.get(ip);

    // بررسی اینکه آیا IP در حالت مسدودیت (Lockout) است یا خیر
    if (record && record.lockoutUntil > now) {
      const remainingMinutes = Math.ceil((record.lockoutUntil - now) / (60 * 1000));
      return NextResponse.json(
        { success: false, error: `تلاش‌های ناموفق بیش از حد مجاز. لطفاً ${remainingMinutes} دقیقه دیگر تلاش کنید.` },
        { status: 429 }
      );
    }

    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "اطلاعات ارسالی نامعتبر است." },
        { status: 400 }
      );
    }

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "نام کاربری و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();
    const genericErrorMessage = "نام کاربری یا رمز عبور اشتباه است.";

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-very-secure-secret-key-12345"
    );

    // تشخیص دقیق پروتکل با استفاده از هدرهای پراکسی (مثل x-forwarded-proto)
    const protoHeader = req.headers.get("x-forwarded-proto");
    const isHttps = protoHeader ? protoHeader === "https" : req.url.startsWith("https://");

    // ----------------------------------------------------
    // ۱. بررسی ادمین کل (Admin) و حالت ثبت‌نام اولین ادمین
    // ----------------------------------------------------
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(cleanPassword, 10);
      const newAdmin = await Admin.create({
        username: cleanUsername,
        password: hashedPassword,
      });

      const token = await new SignJWT({
        userId: newAdmin._id.toString(),
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      loginAttemptsMap.delete(ip);

      const response = NextResponse.json({
        success: true,
        role: "admin",
        redirectUrl: "/admin",
        message: "حساب ادمین با موفقیت ایجاد شد.",
      });

      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: isHttps,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    const admin = await Admin.findOne({ username: cleanUsername });
    if (admin && admin.password) {
      const isMatch = await bcrypt.compare(cleanPassword, admin.password);
      if (isMatch) {
        const token = await new SignJWT({
          userId: admin._id.toString(),
          role: "admin",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        loginAttemptsMap.delete(ip);

        const response = NextResponse.json({
          success: true,
          role: "admin",
          redirectUrl: "/admin",
        });

        response.cookies.set("admin_token", token, {
          httpOnly: true,
          secure: isHttps,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      }
    }

    // ----------------------------------------------------
    // ۲. بررسی معین‌های ارشد (SeniorAdmin)
    // ----------------------------------------------------
    const seniorAdmin = await SeniorAdmin.findOne({ username: cleanUsername });
    if (seniorAdmin && seniorAdmin.password) {
      const isMatch = await bcrypt.compare(cleanPassword, seniorAdmin.password);
      if (isMatch) {
        const token = await new SignJWT({
          userId: seniorAdmin._id.toString(),
          role: "senior-admin",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        loginAttemptsMap.delete(ip);

        const response = NextResponse.json({
          success: true,
          role: "senior-admin",
          redirectUrl: "/senior-admin",
        });

        response.cookies.set("senior_admin_token", token, {
          httpOnly: true,
          secure: isHttps,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      }
    }

    // ----------------------------------------------------
    // ۳. بررسی دانش‌آموز (Student)
    // ----------------------------------------------------
    const student = await Student.findOne({
      $or: [
        { phone: cleanUsername },
        { username: cleanUsername },
        { nationalId: cleanUsername },
      ],
    });

    const studentPassword = student?.password || student?.passwordHash;

    if (student && studentPassword) {
      const isMatch = await bcrypt.compare(cleanPassword, studentPassword);
      if (isMatch) {
        const token = await new SignJWT({
          userId: student._id.toString(),
          id: student._id.toString(),
          username: student.username || student.phone,
          role: "student",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        loginAttemptsMap.delete(ip);

        const response = NextResponse.json({
          success: true,
          role: "student",
          student: {
            nationalId: student.nationalId,
            phone: student.phone,
          },
          redirectUrl: "/student/dashboard",
          message: "ورود با موفقیت انجام شد.",
        });

        // تنظیم هم‌زمان کوکی اختصاصی و کوکی عمومیِ توکن (برای سازگاری با Middlewareها)
        const cookieOptions = {
          httpOnly: true,
          secure: isHttps,
          sameSite: "lax" as const,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        };

        response.cookies.set("student_token", token, cookieOptions);
        response.cookies.set("token", token, cookieOptions); // اضافه شده برای رفع مشکل احتمالی میدل‌ور

        return response;
      }
    }

    // اگر ورود ناموفق بود
    if (!record) {
      loginAttemptsMap.set(ip, { count: 1, lockoutUntil: 0 });
    } else {
      record.count += 1;
      if (record.count >= 5) {
        record.lockoutUntil = now + 3 * 60 * 1000;
        record.count = 0;
      }
    }

    await bcrypt.compare(cleanPassword, "$2a$10$invalidhashvaluetomatchtiming123456789");
    return NextResponse.json(
      { success: false, error: genericErrorMessage },
      { status: 401 }
    );

  } catch (err: any) {
    console.error("Unified Login Error:", err);
    return NextResponse.json(
      { success: false, error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}