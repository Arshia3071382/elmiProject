import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect"; 
import Podcast from "./../../../../../models/Podcast";
import { getCurrentAdmin } from "./../../../../../lib/auth/getCurrentAdmin";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // اگر می‌خواهید امنیت ادمین چک شود، این بخش فعال باشد:
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'عدم دسترسی' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const deleted = await Podcast.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "پادکست مورد نظر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "پادکست با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "خطا در حذف پادکست" }, { status: 500 });
  }
}