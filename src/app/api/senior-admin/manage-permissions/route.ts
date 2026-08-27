import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";
import bcrypt from "bcryptjs";

// GET - دریافت لیست معین‌ها
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "احراز هویت نشده‌اید" },
        { status: 401 }
      );
    }

    await dbConnect();

    // اصلاح فیلد `-password` به جای `-passwordHash`
    const admins = await SeniorAdmin.find({
      role: "senior_admin",
      isActive: true,
    })
      .select("-password -__v")
      .sort({ createdAt: -1 })
      .lean();

    const formattedAdmins = admins.map((admin) => ({
      ...admin,
      _id: admin._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      admins: formattedAdmins,
    });
  } catch (error) {
    console.error("GET manage permissions error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت لیست معین‌ها" },
      { status: 500 }
    );
  }
}

// POST - ایجاد معین ارشد جدید
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "احراز هویت نشده‌اید" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { username, name, password } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: "تمامی فیلدها (نام، نام کاربری، رمز عبور) الزامی هستند." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    
    const existing = await SeniorAdmin.findOne({ username: cleanUsername });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "این نام کاربری قبلاً ثبت شده است." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newSeniorAdmin = await SeniorAdmin.create({
      username: cleanUsername,
      name: name.trim(),
      password: hashedPassword,
      role: "senior_admin",
      permissions: [],
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "معین ارشد با موفقیت ایجاد شد.",
      admin: {
        _id: newSeniorAdmin._id.toString(),
        username: newSeniorAdmin.username,
        name: newSeniorAdmin.name,
        permissions: newSeniorAdmin.permissions,
        role: newSeniorAdmin.role,
        isActive: newSeniorAdmin.isActive,
      },
    });
  } catch (error: any) {
    console.error("POST create senior admin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در ایجاد معین ارشد" },
      { status: 500 }
    );
  }
}

// PUT - تغییر دسترسی معین
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "احراز هویت نشده‌اید" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { username, permissions } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "نام کاربری معتبر نیست" },
        { status: 400 }
      );
    }

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: "دسترسی‌ها باید آرایه باشند" },
        { status: 400 }
      );
    }

    const updatedAdmin = await SeniorAdmin.findOneAndUpdate(
      {
        username: username.trim(),
        role: "senior_admin",
        isActive: true,
      },
      {
        $set: {
          permissions,
        },
      },
      {
        new: true,
      }
    )
      .select("-password -__v")
      .lean();

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, error: "معین موردنظر پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        ...updatedAdmin,
        _id: updatedAdmin._id.toString(),
      },
      message: "دسترسی‌ها با موفقیت بروزرسانی شد",
    });
  } catch (error) {
    console.error("PUT manage permissions error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در بروزرسانی دسترسی‌ها" },
      { status: 500 }
    );
  }
}