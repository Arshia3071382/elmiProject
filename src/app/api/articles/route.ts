import { NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect";
import Article from "./../../../../models/Article";

// دریافت لیست مقالات
export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در دریافت مقالات" }, { status: 500 });
  }
}

// ثبت مقاله جدید
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newArticle = await Article.create(body);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در ایجاد مقاله" }, { status: 500 });
  }
}

// ویرایش مقاله
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: "شناسه مقاله الزامی است" }, { status: 400 });
    }

    const updatedArticle = await Article.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در ویرایش مقاله" }, { status: 500 });
  }
}

// حذف مقاله
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه مقاله الزامی است" }, { status: 400 });
    }

    await Article.findByIdAndDelete(id);
    return NextResponse.json({ message: "مقاله با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف مقاله" }, { status: 500 });
  }
}