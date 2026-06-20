import { NextResponse } from 'next/server';
import { connectToDB } from './../../../../lib/dbConnect';
import Category from './../../../../models/Category';

// تابع کمکی برای اطمینان از لود و کامپایل درست مدل در محیط بی‌لایه Next.js
const getCategoryModel = async () => {
  await connectToDB();
  return Category;
};

export async function GET() {
  try {
    const CategoryModel = await getCategoryModel();
    
    const categories = await CategoryModel.find({}).sort({ createdAt: -1 }).lean();
    const categoriesArray = Array.isArray(categories) ? categories : [];
    
    return NextResponse.json({ success: true, categories: categoriesArray });
  } catch (error) {
    console.error('خطا در دریافت گروه‌ها:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت گروه‌ها';
    return NextResponse.json(
      { success: false, error: errorMessage, categories: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const CategoryModel = await getCategoryModel();
    const body = await request.json();
    
    const { name, description } = body;
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'نام گروه الزامی است' },
        { status: 400 }
      );
    }
    
    // حل مشکل کاراکترهای خاص فارسی در تبدیل به slug برای جلوگیری از تداخل مسیرها
    const slug = encodeURIComponent(name.trim().replace(/\s+/g, '-').toLowerCase());
    
    const existingCategory = await CategoryModel.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'گروهی با این نام قبلاً ثبت شده است' },
        { status: 400 }
      );
    }
    
    const category = await CategoryModel.create({
      name: name.trim(),
      slug,
      description: description || '',
    });
    
    return NextResponse.json({ 
      success: true, 
      category 
    });
  } catch (error) {
    console.error('خطا در ایجاد گروه:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطا در ایجاد گروه';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const CategoryModel = await getCategoryModel();
    const body = await request.json();
    const { id, name } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'شناسه گروه الزامی است' },
        { status: 400 }
      );
    }
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'نام گروه نمی‌تواند خالی باشد' },
        { status: 400 }
      );
    }
    
    const slug = encodeURIComponent(name.trim().replace(/\s+/g, '-').toLowerCase());
    
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name: name.trim(), slug },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'گروه یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('خطا در ویرایش گروه:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطا در ویرایش گروه';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const CategoryModel = await getCategoryModel();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'شناسه گروه الزامی است' },
        { status: 400 }
      );
    }
    
    const category = await CategoryModel.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'گروه یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('خطا در حذف گروه:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطا در حذف گروه';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}