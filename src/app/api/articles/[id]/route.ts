import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Article from "./../../../../../models/Article";

// ویرایش مقاله
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedArticle = await Article.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedArticle) {
      return NextResponse.json({ success: false, message: "مقاله پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطا در ویرایش مقاله" }, { status: 500 });
  }
}

// حذف مقاله
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json({ success: false, message: "مقاله پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "مقاله با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطا در حذف مقاله" }, { status: 500 });
  }
}