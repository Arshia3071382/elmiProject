// app/api/contacts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import Contact from "./../../../../../models/Contact";
import mongoose from "mongoose";

// DELETE - حذف یک پیام
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // دریافت پارامترها از Promise
    const { id } = await params;

    console.log("Received ID for deletion:", id); // برای دیباگ

    // بررسی وجود ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه پیام ارسال نشده است" },
        { status: 400 }
      );
    }

    // بررسی معتبر بودن ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "شناسه پیام نامعتبر است" },
        { status: 400 }
      );
    }

    // پیدا کردن و حذف پیام
    const deletedContact = await Contact.findByIdAndDelete(id);

    // اگر پیام وجود نداشت
    if (!deletedContact) {
      return NextResponse.json(
        { success: false, error: "پیام مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // پاسخ موفقیت‌آمیز
    return NextResponse.json({
      success: true,
      message: "پیام با موفقیت حذف شد",
      deletedContact,
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "خطا در حذف پیام" 
      },
      { status: 500 }
    );
  }
}