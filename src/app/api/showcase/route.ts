import { NextResponse } from 'next/server';
import dbConnect from './../../../../lib/dbConnect';
import Showcase from './../../../../models/Showcase';

export async function GET() {
  await dbConnect();
  try {
    const showcases = await Showcase.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: showcases });
  } catch (error) {
    console.error("GET showcases error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch showcases' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { title, coverImage, images, description, date, slug } = body;

    if (!title || !coverImage || !images || images.length === 0) {
      return NextResponse.json({ success: false, error: 'لطفاً تمام فیلدها و حداقل یک عکس را وارد کنید.' }, { status: 400 });
    }

    // اگر کاربر اسلاگ را دستی وارد کرده باشد از آن استفاده می‌کنیم، در غیر این صورت از روی title می‌سازیم
    let finalSlug = slug ? slug.trim().replace(/\s+/g, '-') : '';
    if (!finalSlug) {
      finalSlug = title.trim().replace(/\s+/g, '-') + '-' + Date.now();
    }

    const newShowcase = await Showcase.create({
      title,
      slug: finalSlug,
      coverImage,
      images,
      description: description || '',
      date: date || '',
    });

    return NextResponse.json({ success: true, data: newShowcase });
  } catch (error: any) {
    console.error("❌ Detailed POST /api/showcase error:", error);
    return NextResponse.json({ success: false, error: error.message || 'خطا در ثبت آلبوم (احتمالاً اسلاگ تکراری است)' }, { status: 500 });
  }
}