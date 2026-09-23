// src/app/api/admin/live/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import LiveStream from "./../../../../../../models/LiveStream";

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    await LiveStream.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطا در حذف برنامه" }, { status: 500 });
  }
}