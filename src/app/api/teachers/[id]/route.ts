import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Teacher from "./../../../../../models/Teacher";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ===============================
// PUT - ویرایش دبیر
// ===============================
export async function PUT(req: Request, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // بررسی معتبر بودن ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه دبیر نامعتبر است",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeacher) {
      return NextResponse.json(
        {
          success: false,
          error: "دبیر موردنظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTeacher,
      message: "اطلاعات دبیر با موفقیت ویرایش شد",
    });
  } catch (error) {
    console.error("Teacher PUT Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطا در ویرایش دبیر",
      },
      { status: 500 },
    );
  }
}

// ===============================
// DELETE - حذف دبیر
// ===============================
export async function DELETE(req: Request, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = await context.params;

    console.log("Deleting teacher:", id);

    // بررسی معتبر بودن ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه دبیر نامعتبر است",
        },
        { status: 400 },
      );
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    // اگر چنین دبیر وجود نداشت
    if (!deletedTeacher) {
      return NextResponse.json(
        {
          success: false,
          error: "دبیر موردنظر پیدا نشد",
        },
        { status: 404 },
      );
    }

    console.log("Teacher deleted successfully:", deletedTeacher._id);

    return NextResponse.json({
      success: true,
      message: "دبیر با موفقیت حذف شد",
      data: deletedTeacher,
    });
  } catch (error) {
    console.error("Teacher DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطا در حذف دبیر",
      },
      { status: 500 },
    );
  }
}
