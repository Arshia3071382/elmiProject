import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import SeniorAdmin from "./../../../../../models/SeniorAdmin";

// ۱. دریافت لیست تمام معین‌های ارشد
export async function GET() {
  try {
    await dbConnect();
    const admins = await SeniorAdmin.find({}).select("-passwordHash");
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت معین‌ها" },
      { status: 500 }
    );
  }
}

// ۲. بروزرسانی دسترسی‌های یک معین مشخص
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { username, permissions } = await req.json();

    if (!username || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: "اطلاعات ورودی نامعتبر است." },
        { status: 400 }
      );
    }

    const updatedAdmin = await SeniorAdmin.findOneAndUpdate(
      { username },
      { $set: { permissions } },
      { new: true }
    ).select("-passwordHash");

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, error: "معین مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, admin: updatedAdmin });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در بروزرسانی دسترسی‌ها" },
      { status: 500 }
    );
  }
}