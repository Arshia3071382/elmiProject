import { NextRequest, NextResponse } from "next/server";
import connectDB from "./../../../../lib/dbConnect"; 
import Notice from "./../../../../models/Notice";

// Get notices with built-in pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 8;
    const skip = (page - 1) * limit;

    const total = await Notice.countDocuments();
    const notices = await Notice.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    return NextResponse.json({ success: true, notices, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

// Create notice and auto-delete oldest if count exceeds 20
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Save new notice
    const newNotice = await Notice.create(body);

    // Keep collection size within 20 items maximum
    const allNotices = await Notice.find().sort({ createdAt: -1 });
    if (allNotices.length > 20) {
      const idsToDelete = allNotices.slice(20).map(n => n._id);
      await Notice.deleteMany({ _id: { $in: idsToDelete } });
    }

    return NextResponse.json({ success: true, data: newNotice });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Creation Failed" }, { status: 500 });
  }
}