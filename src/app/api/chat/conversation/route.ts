// src/app/api/chat/conversation/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Topic from "./../../../../../models/Topic";
import Conversation from "../../../../../models/Conversation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Conversation slug is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const conversation = await Conversation.findOne({ slug });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}