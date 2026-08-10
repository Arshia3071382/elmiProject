import { NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect";
import Comment from "./../../../../models/Comment";

// تابع تولید تاریخ شمسی خودکار به فرمت 1405/05/12
const getPersianDate = () => {
  return new Date().toLocaleDateString('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export async function GET() {
  await dbConnect();
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت نظرات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // اگر تاریخ ارسال نشده باشد، به صورت خودکار تاریخ روز را اضافه می‌کنیم
    const commentData = {
      ...body,
      date: body.date || getPersianDate(),
    };

    const newComment = await Comment.create(commentData);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در ایجاد نظر" }, { status: 500 });
  }
}