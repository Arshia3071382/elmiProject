// app/api/calendar/route.ts
import { NextResponse } from "next/server";
import connectDB from "./../../../../lib/dbConnect";
import CalendarMonth from "./../../../../models/CalendarMonth";

// دریافت لیست ماه‌ها
export async function GET() {
  try {
    await connectDB();
    const months = await CalendarMonth.find({}).sort({ monthNumber: 1 });
    return NextResponse.json({ success: true, months }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ثبت یا ویرایش ماه
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { year, monthNumber, monthName, startDayOfWeek, events } = body;

    let monthDoc = await CalendarMonth.findOne({ monthNumber });

    if (monthDoc) {
      monthDoc.year = year;
      monthDoc.monthName = monthName;
      monthDoc.startDayOfWeek = startDayOfWeek;
      monthDoc.events = events;
      await monthDoc.save();
    } else {
      monthDoc = await CalendarMonth.create({
        year,
        monthNumber,
        monthName,
        startDayOfWeek,
        events,
      });
    }

    return NextResponse.json({ success: true, month: monthDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// حذف ماه (جدید)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "شناسه ماه ارسال نشده است" }, { status: 400 });
    }

    await CalendarMonth.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "ماه با موفقیت حذف شد" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}