import { NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import Student from "./../../../../../../models/Student";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, props: RouteParams) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه کاربر ارسال نشده است" },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموز مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "دانش‌آموز با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { success: false, error: "خطا در سرور هنگام حذف دانش‌آموز" },
      { status: 500 }
    );
  }
}