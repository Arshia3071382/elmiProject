import { NextResponse } from 'next/server';
import dbConnect from './../../../../lib/dbConnect';
import Notice from './../../../../models/Notice';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('Received body:', body); // برای دیباگ
    
    const { title, content, image, imageLayout, type, eventDate } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required', success: false },
        { status: 400 }
      );
    }

    const notice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
      image: image ? image.trim() : null,
      imageLayout: imageLayout || 'vertical', // ذخیره حالت نمایش تصویر (عمودی یا افقی)
      type: type || 'news',
      eventDate: eventDate ? eventDate.trim() : null, // ذخیره تاریخ به صورت متن دلخواه
    });

    console.log('Notice created:', notice); // برای دیباگ

    return NextResponse.json(
      { message: 'Notice created successfully', notice, success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error', 
        success: false,
        details: error.stack 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ notices, success: true });
  } catch (error: any) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Notice ID is required', success: false },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // اگر فقط تغییر وضعیت خوانده شدن بود
    if (body.hasOwnProperty('isRead') && Object.keys(body).length === 1) {
      const notice = await Notice.findByIdAndUpdate(
        id, 
        { isRead: body.isRead }, 
        { new: true }
      );

      if (!notice) {
        return NextResponse.json(
          { error: 'Notice not found', success: false },
          { status: 404 }
        );
      }

      return NextResponse.json({ notice, success: true });
    }

    // حالت ویرایش کامل اعلان
    const { title, content, image, imageLayout, type, eventDate } = body;
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required', success: false },
        { status: 400 }
      );
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        content: content.trim(),
        image: image ? image.trim() : null,
        imageLayout: imageLayout || 'vertical',
        type: type || 'news',
        eventDate: eventDate ? eventDate.trim() : null,
      },
      { new: true }
    );

    if (!updatedNotice) {
      return NextResponse.json(
        { error: 'Notice not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ notice: updatedNotice, success: true });
  } catch (error: any) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Notice ID is required', success: false },
        { status: 400 }
      );
    }

    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Notice deleted successfully', success: true });
  } catch (error: any) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', success: false },
      { status: 500 }
    );
  }
}