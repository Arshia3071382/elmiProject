import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import ChatTopic from "./../../../../../models/ChatTopic";

// دریافت تمام تاپیک‌ها
export async function GET() {
  try {
    await dbConnect();
    const topics = await ChatTopic.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: topics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ثبت تاپیک جدید
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, slug, description, questions } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "عنوان و اسلاگ تاپیک الزامی است." },
        { status: 400 }
      );
    }

    const existing = await ChatTopic.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "تاپیکی با این اسلاگ قبلاً ثبت شده است." },
        { status: 400 }
      );
    }

    const newTopic = await ChatTopic.create({
      title,
      slug,
      description,
      questions: questions || [],
    });

    return NextResponse.json({ success: true, data: newTopic });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}