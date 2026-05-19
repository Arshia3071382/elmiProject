// app/api/courses/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Course from './../../../../models/Course';
import Category from './../../../../models/Category';
import { connectToDB } from './../../../../lib/dbConnect';
import { log } from 'console';


export async function POST(request: Request) {
  try {
    await connectToDB();
    
    const { name, categoryId } = await request.json();
    
   
    
    // validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'نام دوره الزامی است' },
        { status: 400 }
      );
    }
    
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'شناسه گروه الزامی است' },
        { status: 400 }
      );
    }
    
    //  ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'شناسه گروه نامعتبر است' },
        { status: 400 }
      );
    }
    
    // find group
    const category = await Category.findById(categoryId);
     
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: `گروه با شناسه ${categoryId} یافت نشد` },
        { status: 404 }
      );
    }
    
    // create course
    const course = await Course.create({
      name: name.trim(),
      category: categoryId,
    });
    
    const populatedCourse = await course.populate('category', 'name');
    
    return NextResponse.json({ 
      success: true, 
      course: populatedCourse 
    });
    
  } catch (error) {
    console.error('Error in POST /api/courses:', error);
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    
    let query = {};
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      query = { category: categoryId };
    }
    
    const courses = await Course.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, courses });
    
  } catch (error) {
    console.error('Error in GET /api/courses:', error);
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}



// delete course

export async function DELETE(request: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'آیدی دوره الزامی است' },
        { status: 400 }
      );
    }
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'آیدی دوره نامعتبر است' },
        { status: 400 }
      );
    }
    
    
    const deletedCourse = await Course.findByIdAndDelete(id);
    
    
    
    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, error: 'دوره مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'دوره با موفقیت حذف شد',
      deletedCourse 
    });
    
  } catch (error) {
    console.error('❌ Error in DELETE:', error);
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}

//update course

export async function PUT(request : Request){
 try{
  await connectToDB()

  const{id , name , categoryId} = await request.json()

  if(!id || !name){
    return NextResponse.json(
      {success : false , error : 'آیدی و نام دوره الزامی است'} ,
      {status : 400}
    )

  }
  const existingCourse = await Course.findById(id)

  if(!existingCourse){
    return NextResponse.json(
      {success : false , error:"دوره مورد نظر یافت نشد"} , 
      {status : 400}
    )
  }

  const updatedCourse = await Course.findByIdAndUpdate(id , 
    {
      name : name.trim() ,
      category : categoryId || existingCourse.category ,
      updateAt : new Date()

    },
  {new : true}).populate('category' , 'name')

  return NextResponse.json(
    {success : true , course : updatedCourse}
  )
 } catch(error){
  return NextResponse.json({
   success : false , error 
  },
{status : 500})
 }
}