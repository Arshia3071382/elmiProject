import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import SeoSetting from "./../../../../../models/SeoSetting";

const DEFAULT_SEO = {
  title: "مجموعه علمی منتظران",
  description: "سامانه علمی و آموزشی مجموعه علمی منتظران",
  keywords: "منتظران, 313, منتظران 313, هیئت منتظران",
};

export async function GET() {
  try {
    await dbConnect();
    let setting = await SeoSetting.findOne();
    if (!setting) {
      setting = await SeoSetting.create(DEFAULT_SEO);
    }
    return NextResponse.json({ success: true, data: setting }, { status: 200 });
  } catch (err) {
    console.error("Error in GET seo:", err);
    return NextResponse.json({ success: false, error: "خطا در دریافت تنظیمات سئو" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, keywords } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ success: false, error: "عنوان و توضیحات الزامی هستند" }, { status: 400 });
    }

    let setting = await SeoSetting.findOne();
    if (!setting) {
      setting = new SeoSetting();
    }
    setting.title = title.trim();
    setting.description = description.trim();
    setting.keywords = (keywords || "").trim();
    await setting.save();

    return NextResponse.json({ success: true, data: setting }, { status: 200 });
  } catch (err) {
    console.error("Error in PUT seo:", err);
    return NextResponse.json({ success: false, error: "خطا در ذخیره تنظیمات سئو" }, { status: 500 });
  }
}