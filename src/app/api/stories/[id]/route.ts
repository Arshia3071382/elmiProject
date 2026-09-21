import { NextRequest, NextResponse } from 'next/server';
import dbConnect from './../../../../../lib/dbConnect'; 
import Story from './../../../../../models/Story';
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();
    const deletedStory = await Story.findByIdAndDelete(id);

    if (!deletedStory) {
      return NextResponse.json({ success: false, error: 'استوری یافت نشد' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'استوری با موفقیت حذف شد' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}