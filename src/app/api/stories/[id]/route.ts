import { NextRequest, NextResponse } from 'next/server';
// ایمپورت‌های دیتابیس یا مدل‌های شما (مثلا اتصال به موندگوبیس یا سوپابیس)

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // در Next.js جدید باید ابتدا params را await کنید
    const { id } = await context.params;

    // کدهای مربوط به حذف استوری بر اساس id از دیتابیس
    // مثال: await Story.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'استوری با موفقیت حذف شد' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}