import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import ChatTopic from "../../../../models/ChatTopic";

// GET - دریافت همه تاپیک‌ها
export async function GET() {
  try {
    await dbConnect();
    const topics = await ChatTopic.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت تاپیک‌ها" },
      { status: 500 }
    );
  }
}

// POST - ایجاد تاپیک جدید
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { title, slug, description, questions } = body;
    
    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "عنوان و اسلاگ الزامی است" },
        { status: 400 }
      );
    }
    
    const existing = await ChatTopic.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "این اسلاگ قبلاً استفاده شده است" },
        { status: 400 }
      );
    }
    
    const topic = await ChatTopic.create({
      title,
      slug,
      description: description || "",
      questions: questions || [],
    });
    
    return NextResponse.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد تاپیک" },
      { status: 500 }
    );
  }
}