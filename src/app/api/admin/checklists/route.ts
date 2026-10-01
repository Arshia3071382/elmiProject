import { NextResponse } from 'next/server';
import dbConnect from './../../../../../lib/dbConnect';
import Checklist from './../../../../../models/Checklist';

// دریافت تمام چک‌لیست‌ها
export async function GET() {
  try {
    await dbConnect();
    const checklists = await Checklist.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: checklists }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ثبت چک‌لیست جدید
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { category, studentName, itemText, priority, persianDate } = body;

    if (!category || !itemText || !priority || !persianDate) {
      return NextResponse.json({ success: false, message: 'لطفاً تمام فیلدهای ضروری را پر کنید.' }, { status: 400 });
    }

    const newChecklist = await Checklist.create({
      category,
      studentName: studentName || '',
      itemText,
      priority,
      persianDate,
      isCompleted: false,
    });

    return NextResponse.json({ success: true, data: newChecklist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// تغییر وضعیت چک‌لیست (رسیدگی شد / لغو رسیدگی)
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, isCompleted } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه چک‌لیست الزامی است.' }, { status: 400 });
    }

    const updated = await Checklist.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'چک‌لیست مورد نظر پیدا نشد.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}