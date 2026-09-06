import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Showcase from '../../../../../models/Showcase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// حذف آلبوم بر اساس ID
export async function DELETE(req: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedShowcase = await Showcase.findByIdAndDelete(id);

    if (!deletedShowcase) {
      return NextResponse.json({ success: false, error: 'آلبوم مورد نظر یافت نشد.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'آلبوم با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error("DELETE showcase error:", error);
    return NextResponse.json({ success: false, error: error.message || 'خطا در حذف آلبوم' }, { status: 500 });
  }
}

// ویرایش آلبوم بر اساس ID
export async function PUT(req: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, coverImage, images, description, date, slug } = body;

    let finalSlug = slug ? slug.trim().replace(/\s+/g, '-') : '';
    if (!finalSlug && title) {
      finalSlug = title.trim().replace(/\s+/g, '-');
    }

    const updatedData: any = {
      title,
      coverImage,
      images,
      description: description || '',
      date: date || '',
    };
    if (finalSlug) updatedData.slug = finalSlug;

    const updatedShowcase = await Showcase.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedShowcase) {
      return NextResponse.json({ success: false, error: 'آلبوم مورد نظر یافت نشد.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedShowcase });
  } catch (error: any) {
    console.error("PUT showcase error:", error);
    return NextResponse.json({ success: false, error: error.message || 'خطا در ویرایش آلبوم' }, { status: 500 });
  }
}