import { NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect"; 
import Article from "./../../../../models/Article"; 

// اجبار Next.js به عدم کش کردن این Route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ۱. دریافت مقالات (GET)
export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, articles },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "خطا در دریافت مقالات" }, { status: 500 });
  }
}

// ۲. ثبت مقاله جدید (POST)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { title, slug, summary, blocks } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: "عنوان و اسلاگ الزامی هستند" },
        { status: 400 }
      );
    }

    const newArticle = await Article.create({
      title,
      slug,
      summary,
      blocks,
    });

    return NextResponse.json(
      { success: true, message: "مقاله با موفقیت ثبت شد", article: newArticle },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "خطا در ثبت مقاله" },
      { status: 500 }
    );
  }
}

// ۳. ویرایش مقاله (PUT)
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, title, slug, summary, blocks } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "شناسه مقاله (_id) الزامی است" },
        { status: 400 }
      );
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      _id,
      { title, slug, summary, blocks },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, message: "مقاله مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "مقاله با موفقیت بروزرسانی شد", article: updatedArticle }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "خطا در بروزرسانی مقاله" },
      { status: 500 }
    );
  }
}

// ۴. حذف مقاله (DELETE)
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه مقاله الزامی است" },
        { status: 400 }
      );
    }

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json(
        { success: false, message: "مقاله مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "مقاله با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "خطا در حذف مقاله" },
      { status: 500 }
    );
  }
}