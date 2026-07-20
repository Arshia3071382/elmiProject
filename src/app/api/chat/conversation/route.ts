import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import { Topic } from "./../../../../../models/Topic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const topicSlug = searchParams.get("topic");
    const nodeSlug = searchParams.get("slug");

    if (!topicSlug) {
      return NextResponse.json(
        { success: false, message: "پارامتر topic الزامی است." },
        { status: 400 }
      );
    }

    const topic = await Topic.findOne({ slug: topicSlug }).lean();

    if (!topic || !topic.nodes) {
      return NextResponse.json(
        { success: false, message: "تاپیک یا گره‌ها یافت نشدند." },
        { status: 404 }
      );
    }

    const nodesObj = topic.nodes as Record<string, any>;

    // ۱. تعیین کلید گره هدف
    let targetNodeKey: string = nodeSlug || "";

    // اگر بار اول است یا گره دریافتی نامشخص/استارت است
    if (!targetNodeKey || targetNodeKey === `${topicSlug}-start`) {
      if (nodesObj[`${topicSlug}-start`]) {
        targetNodeKey = `${topicSlug}-start`;
      } else if (topic.startNodeId && nodesObj[topic.startNodeId]) {
        targetNodeKey = topic.startNodeId;
      } else if (nodesObj["start"]) {
        targetNodeKey = "start";
      } else {
        // اولین کلید موجود در nodes را به عنوان شروع انتخاب کن
        targetNodeKey = Object.keys(nodesObj)[0] || "";
      }
    }

    // دسترسی به گره
    const currentNode = nodesObj[targetNodeKey];

    if (!currentNode) {
      return NextResponse.json(
        { success: false, message: `گره '${targetNodeKey}' یافت نشد.` },
        { status: 404 }
      );
    }

    // ۲. فرمت‌دهی هوشمند پیام‌ها (پشتیبانی همزمان از messages و advisorMessage)
    let formattedMessages: any[] = [];

    if (Array.isArray(currentNode.messages) && currentNode.messages.length > 0) {
      formattedMessages = currentNode.messages;
    } else if (currentNode.advisorMessage) {
      formattedMessages = [
        {
          id: `msg-${targetNodeKey}`,
          sender: "advisor",
          text: currentNode.advisorMessage,
          typing: 800,
        },
      ];
    }

    // ۳. فرمت‌دهی هوشمند گزینه‌ها (پشتیبانی همزمان از choices و options)
    const rawChoices = currentNode.choices || currentNode.options || [];
    const formattedChoices = rawChoices.map((opt: any, index: number) => ({
      id: opt.id || `opt-${index}`,
      text: opt.text,
      next: opt.next || opt.nextNodeId || opt.nextNode || "start",
    }));

    return NextResponse.json({
      success: true,
      data: {
        title: currentNode.title || "",
        messages: formattedMessages,
        choices: formattedChoices,
      },
    });
  } catch (error: any) {
    console.error("Conversation API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}