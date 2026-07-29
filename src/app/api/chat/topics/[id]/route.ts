import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import ChatTopic from "./../../../../../../models/ChatTopic";
import mongoose from "mongoose";

// دریافت یک تاپیک خاص بر اساس ID یا Slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const topic = await ChatTopic.findOne(query);

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "تاپیک مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// حذف یک تاپیک بر اساس ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedTopic = await ChatTopic.findByIdAndDelete(id);

    if (!deletedTopic) {
      return NextResponse.json(
        { success: false, error: "تاپیک یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تاپیک با موفقیت حذف شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}