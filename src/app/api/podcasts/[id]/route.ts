import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Podcast from "../../../../../models/Podcast";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // =========================
    // دریافت ID
    // =========================

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه پادکست ارسال نشده است",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // اتصال به MongoDB
    // =========================

    await dbConnect();

    // =========================
    // حذف پادکست
    // =========================

    const deletedPodcast =
      await Podcast.findByIdAndDelete(id);

    // =========================
    // پادکست پیدا نشد
    // =========================

    if (!deletedPodcast) {
      return NextResponse.json(
        {
          success: false,
          error: "پادکست موردنظر پیدا نشد",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // پاسخ موفق
    // =========================

    return NextResponse.json({
      success: true,
      message: "پادکست با موفقیت حذف شد",
      deletedId: deletedPodcast._id,
    });
  } catch (error) {
    console.error("DELETE PODCAST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "خطا در حذف پادکست",
      },
      {
        status: 500,
      },
    );
  }
}