import { NextResponse } from 'next/server';
import dbConnect from './../../../../lib/dbConnect';
import Podcast from './../../../../models/Podcast';

export async function GET() {
  try {
    await dbConnect();
    const podcasts = await Podcast.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: podcasts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'خطا در دریافت پادکست‌ها' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, audioUrl, duration } = body;

    if (!title || !audioUrl) {
      return NextResponse.json({ success: false, error: 'عنوان و لینک فایل صوتی الزامی است' }, { status: 400 });
    }

    const newPodcast = await Podcast.create({
      title,
      description,
      audioUrl,
      duration
    });

    return NextResponse.json({ success: true, data: newPodcast });
  } catch (error) {
    console.error("Podcast POST Error:", error);
    return NextResponse.json({ success: false, error: 'خطا در ثبت پادکست' }, { status: 500 });
  }
}