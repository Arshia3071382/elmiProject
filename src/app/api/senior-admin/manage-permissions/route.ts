
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";
import { jwtVerify } from "jose"; // 🔒 در صورت نیاز به بررسی امنیتی توکن ادمین

// کمکی برای اعتبارسنجی ادمین اصلی
async function verifyAdminAuth(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "elmi_super_secret_jwt_key_2026_secure_random_string"
    );
    await jwtVerify(token, secret);
    return true;
  } catch (e) {
    // اگر توکن ساختار JWT داشت و نامعتبر بود خطا می‌دهد، 
    // اگر ادمین اصلی از روش دیگری (مثل Base64 یا سشن) استفاده می‌کند می‌توانید این بخش را تطبیق دهید.
    return false;
  }
}

// GET - دریافت لیست معین‌ها
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "احراز هویت نشده‌اید",
        },
        {
          status: 401,
        }
      );
    }

    await dbConnect();

    // دریافت تمام معین‌ها
    const admins = await SeniorAdmin.find({
      role: "senior_admin",
      isActive: true,
    })
      .select("-passwordHash -__v")
      .sort({
        createdAt: -1,
      })
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
      {
        success: false,
        error: "خطا در دریافت لیست معین‌ها",
      },
      {
        status: 500,
      }
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
        {
          success: false,
          error: "احراز هویت نشده‌اید",
        },
        {
          status: 401,
        }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { username, permissions } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "نام کاربری معتبر نیست",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی‌ها باید آرایه باشند",
        },
        {
          status: 400,
        }
      );
    }

    // فقط معین‌ها قابل تغییر هستند
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
      .select("-passwordHash -__v")
      .lean();

    if (!updatedAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "معین موردنظر پیدا نشد",
        },
        {
          status: 404,
        }
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
      {
        success: false,
        error: "خطا در بروزرسانی دسترسی‌ها",
      },
      {
        status: 500,
      }
    );
  }
}