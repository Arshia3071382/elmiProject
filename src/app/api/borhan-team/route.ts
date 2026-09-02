import { NextResponse } from 'next/server';
import dbConnect from './../../../../lib/dbConnect';
import BorhanMember from './../../../../models/BorhanTeam'; // فرض بر این است که مدل Mongoose را ایجاد کرده‌اید

export async function GET() {
  try {
    await dbConnect();
    // دریافت تمام اعضا مرتب‌شده بر اساس جدیدترین
    const members = await BorhanMember.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: members }, { status: 200 });
  } catch (error: any) {
    console.error("GET Borhan Team Error:", error);
    return NextResponse.json({ success: false, message: error.message || 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { role, fullName, phone } = body;
    if (!role || !fullName || !phone) {
      return NextResponse.json({ success: false, message: 'اطلاعات ضروری ناقص است.' }, { status: 400 });
    }

    const newMember = await BorhanMember.create(body);
    return NextResponse.json({ success: true, message: 'با موفقیت ثبت شد', data: newMember }, { status: 201 });
  } catch (error: any) {
    console.error("POST Borhan Team Error:", error);
    return NextResponse.json({ success: false, message: error.message || 'خطای سرور' }, { status: 500 });
  }
}