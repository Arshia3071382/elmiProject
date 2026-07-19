// src/app/api/chat/start/route.ts
import { NextResponse } from "next/server";
import Topic from "./../../../../../models/Topic";
import Conversation from "../../../../../models/Conversation";
import dbConnect from "../../../../../lib/dbConnect";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicSlug = searchParams.get("topic");

    console.log(`📡 [API] Fetching conversation for topic: ${topicSlug}`);

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
    }).lean();

    if (!conversation) {
      console.log(`⚠️ [API] No start conversation found for topic: ${topicSlug}`);
      return NextResponse.json(
        { success: false, error: "No start conversation found" },
        { status: 404 }
      );
    }

    // ✅ استفاده از _id.toString()
    const formattedConversation = {
      id: conversation._id.toString(), // ✅ تبدیل ObjectId به string
      slug: conversation.slug,
      title: conversation.title,
      topicSlug: conversation.topicSlug,
      isStart: conversation.isStart,
      isEnd: conversation.isEnd,
      messages: conversation.messages || [],
      choices: conversation.choices || [],
      createdAt: conversation.createdAt,
    };

    console.log(`✅ [API] Conversation found: ${formattedConversation.slug}`);

    return NextResponse.json({
      success: true,
      data: formattedConversation,
    });
  } catch (error) {
    console.error("❌ [API] Error fetching conversation:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch conversation",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}