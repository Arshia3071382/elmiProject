import { NextResponse } from 'next/server';
import dbConnect from './../../../../../../../lib/dbConnect';
import BorhanApplication from '../../../../../../../models/BorhanTeam';
import { getCurrentAdmin } from './../../../../../../../lib/auth/getCurrentAdmin';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { status } = await req.json();

    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'وضعیت نامعتبر است.' }, { status: 400 });
    }

    const updated = await BorhanApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'درخواست یافت نشد.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update borhan application status error:', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}