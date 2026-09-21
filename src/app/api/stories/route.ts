import { NextResponse } from 'next/server';
import dbConnect from './../../../../lib/dbConnect';
import Story from './../../../../models/Story';
// اگر سیستم احراز هویت ادمین دارید میتونید ایمپورت کنید، بستگی به ساختار بقیه APIهای ادمین داره

// گرفتن لیست استوری‌ها (برای نمایش در اپلیکیشن و پنل ادمین)
export async function GET() {
  try {
    await dbConnect();
    // استوری‌هایی که منقضی نشده‌اند یا تاریخ انقضا ندارند را برمی‌گردانیم
    const now = new Date();
    const stories = await Story.find({
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, stories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ایجاد استوری جدید (توسط ادمین)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, image, link, durationDays } = body;

    if (!image) {
      return NextResponse.json({ success: false, error: 'تصویر پوستر الزامی است' }, { status: 400 });
    }

    // محاسبه تاریخ انقضا (پیش‌فرض مثلاً ۲۴ ساعت یا چند روز بعد، یا اختیاری)
    let expiresAt = undefined;
    if (durationDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(durationDays));
    }

    const newStory = await Story.create({
      title,
      image,
      link,
      expiresAt,
    });

    return NextResponse.json({ success: true, story: newStory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}