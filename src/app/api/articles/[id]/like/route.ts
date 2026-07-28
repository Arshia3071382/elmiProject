import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Article from "./../../../../../../models/Article";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const { id: articleId } = await params;

    const article = await Article.findById(articleId);
    if (!article) {
      return NextResponse.json({ message: "مقاله پیدا نشد" }, { status: 404 });
    }

    const hasLiked = article.likedIPs?.includes(ip);

    if (hasLiked) {
      return NextResponse.json(
        {
          message: "شما قبلاً این مقاله را لایک کرده‌اید",
          likes: article.likes,
          hasLiked: true,
        },
        { status: 400 }
      );
    }

    article.likes = (article.likes || 0) + 1;
    if (!article.likedIPs) article.likedIPs = [];
    article.likedIPs.push(ip);
    await article.save();

    return NextResponse.json({
      success: true,
      likes: article.likes,
      hasLiked: true,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}