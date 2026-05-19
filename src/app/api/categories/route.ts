
import { NextResponse } from 'next/server';
import { connectToDB } from './../../../../lib/dbConnect';
import Category from './../../../../models/Category';


export async function GET() {
  try {
    await connectToDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('خطا در دریافت گروه‌ها:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت گروه‌ها: ' + error },
      { status: 500 }
    );
  }
}

// POST: create new group  
export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    console.log("داده دریافتی برای ساخت گروه:", body); 
    
    const { name, description } = body;
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'نام گروه الزامی است' },
        { status: 400 }
      );
    }
    
    // create slug from name
    const slug = name.trim().replace(/\s+/g, '-');
    
    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
    });
    
    console.log("گروه ساخته شد:", category);
    
    return NextResponse.json({ 
      success: true, 
      category 
    });
  } catch (error) {
    console.error('خطا در ایجاد گروه:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ایجاد گروه: ' + error },
      { status: 500 }
    );
  }
}