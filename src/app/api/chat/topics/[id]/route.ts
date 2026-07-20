import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import { Topic } from "./../../../../../../models/Topic";

// GET: دریافت یک تاپیک با ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const topic = await Topic.findById(id).lean();

    if (!topic) {
      return NextResponse.json({ success: false, error: "تاپیک یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: بروزرسانی تاپیک
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const updatedTopic = await Topic.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTopic) {
      return NextResponse.json({ success: false, message: "تاپیک یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTopic });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: حذف تاپیک
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    await Topic.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "تاپیک با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}