import { NextResponse } from 'next/server';
import dbConnect from './../../../../../../lib/dbConnect';
import BorhanApplication from '../../../../../../models/BorhanTeam';
import { getCurrentAdmin } from './../../../../../../lib/auth/getCurrentAdmin';

export async function GET(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { school: { $regex: search, $options: 'i' } },
        { job: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await BorhanApplication.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Fetch borhan applications error:', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}