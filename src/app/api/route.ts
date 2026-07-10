import { NextResponse } from "next/server";
import { connectToDB } from "./../../../lib/dbConnect"; 
import Course from "./../../../models/Course";
import Category from "./../../../models/Category"; 

const ensureModelsRegistered = () => {
  if (!Category) console.log("Initializing Category model...");
  if (!Course) console.log("Initializing Course model...");
};

export async function GET(req: Request) {
  try {
    await connectToDB();
    ensureModelsRegistered();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = {};
    if (category) {
      query = { category };
    }

    const courses = await Course.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    const coursesArray = Array.isArray(courses) ? courses : [];
    
    return NextResponse.json({ success: true, courses: coursesArray });
  } catch (error) {
    console.error("خطا در GET courses:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت دوره‌ها", courses: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    ensureModelsRegistered();
    
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = (formData.get("description") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    
    const videoFile = formData.get("video"); 

    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, error: "نام دوره و گروه الزامی است" },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "گروه مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const course = await Course.create({
      name: name.trim(),
      category: categoryId,
      description: description.trim(),
      duration: duration.trim(),
    });

    const populatedCourse = await Course.findById(course._id).populate("category").lean();

    return NextResponse.json({ success: true, course: populatedCourse });
  } catch (error) {
    console.error("خطا در POST course:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد دوره" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDB();
    ensureModelsRegistered();

    const body = await req.json();
    const { id, name, categoryId, description, duration } = body;

    if (!id || !name || !categoryId) {
      return NextResponse.json(
        { success: false, error: "تمامی فیلدها برای ویرایش الزامی هستند" },
        { status: 400 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { 
        name: name.trim(), 
        category: categoryId,
        ...(description !== undefined && { description: description.trim() }),
        ...(duration !== undefined && { duration: duration.trim() })
      },
      { new: true, runValidators: true }
    ).populate("category").lean();

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, error: "دوره مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error("خطا در PUT course:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ویرایش دوره" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه دوره الزامی است" },
        { status: 400 }
      );
    }

    const course = await Course.findByIdAndDelete(id);
    
    if (!course) {
      return NextResponse.json(
        { success: false, error: "دوره یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطا در DELETE course:", error);
    return NextResponse.json(
      { success: false, error: "خطا در حذف دوره" },
      { status: 500 }
    );
  }
}