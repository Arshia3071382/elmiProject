import { NextResponse } from "next/server";
import dbConnect from "./../../../../../..//lib/dbConnect"; // اتصال دیتابیس پروژه شما
import Topic from "./../../../../../..//models/ChatTopic";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    // اگر id ارسالی یک ObjectId معتبر بود بر اساس id بگرد، در غیر این صورت بر اساس slug بگرد
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const topic = await Topic.findOne(query);

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "تاپیک مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: topic,
    });
  } catch (error: any) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت اطلاعات از سرور" },
      { status: 500 }
    );
  }
}