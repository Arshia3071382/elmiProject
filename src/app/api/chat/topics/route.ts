// src/app/api/chat/topics/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect"; // ✅ استفاده از Alias مسیر استاندارد
import Topic from "./../../../../../models/Topic"; // ✅ استفاده از Alias مسیر استاندارد

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const topics = await Topic.find({}).sort({ createdAt: 1 }).lean();
    
    return NextResponse.json(
      { success: true, data: topics },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error("❌ [API Topics] Error fetching topics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}