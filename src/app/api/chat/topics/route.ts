import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import { Topic } from "./../../../../../models/Topic";
export async function GET() {
  try {
    await dbConnect();
    const topics = await Topic.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: topics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { title, slug, description, startNodeId, nodes } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: "عنوان و اسلاگ الزامی هستند." },
        { status: 400 }
      );
    }

    const newTopic = await Topic.create({
      title,
      slug,
      description,
      startNodeId: startNodeId || "start",
      nodes: nodes || {},
    });

    return NextResponse.json({ success: true, data: newTopic }, { status: 201 });
  } catch (error: any) {
    console.error("Mongoose POST Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "خطا در ثبت دیتابیس" },
      { status: 500 }
    );
  }
}