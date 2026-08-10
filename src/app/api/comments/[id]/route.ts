import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect"; 
import Comment from "./../../../../../models/Comment";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await Comment.findByIdAndUpdate(id, body, { new: true });
    
    if (!updated) {
      return NextResponse.json({ error: "نظر مورد نظر یافت نشد" }, { status: 404 });
    }
    
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در ویرایش نظر" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "نظر مورد نظر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "نظر با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در حذف نظر" }, { status: 500 });
  }
}