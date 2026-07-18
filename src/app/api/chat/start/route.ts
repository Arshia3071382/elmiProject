// src/app/api/chat/start/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Topic from "./../../../../../models/Topic";
import Conversation from "../../../../../models/Conversation";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicSlug = searchParams.get("topic");

    if (!topicSlug) {
      return NextResponse.json(
        { success: false, error: "Topic slug is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const conversation = await Conversation.findOne({
      topicSlug,
      isStart: true,
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "No start conversation found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error fetching start conversation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}