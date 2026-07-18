// src/app/api/chat/topics/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Topic from "./../../../../../models/Topic";

export async function GET() {
  try {
    await dbConnect();
    const topics = await Topic.find({}).sort({ createdAt: 1 });
    return NextResponse.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}