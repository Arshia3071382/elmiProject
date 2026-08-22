import { NextResponse } from "next/server";
import dbConnect from "./../../../../../lib/dbConnect";
import GradeStudent from "./../../../../../models/GradeStudent";
import LeagueSetting from "./../../../../../models/LeagueSetting";
import Student from "./../../../../../models/Student"; 

// Type برای پاسخ API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== GET ====================
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");
  const published = searchParams.get("published") === "true";

  try {
    const filter: any = {};
    if (grade) filter.grade = Number(grade);
    if (published) filter.published = true;

    const students = await GradeStudent.find(filter).sort({ totalScore: -1 });
    
    // دریافت زمان آخرین بروزرسانی
    const setting = await LeagueSetting.findOne();
    const lastUpdate = setting?.lastUpdate || null;

    return NextResponse.json({
      success: true,
      students,
      lastUpdate: lastUpdate ? lastUpdate.toISOString() : null,
    });
  } catch (err) {
    console.error("Error in GET:", err);
    return NextResponse.json(
      { success: false, error: "خطا در گرفتن داده‌ها" },
      { status: 500 }
    );
  }
}

// ==================== POST ====================
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { firstName, lastName, nationalId, grade } = body;

    if (!firstName || !lastName || !nationalId || !grade) {
      return NextResponse.json(
        { success: false, error: "نام، نام خانوادگی، کد ملی و پایه الزامی هستند" },
        { status: 400 }
      );
    }

    const trimmedNationalId = nationalId.trim();

    // بررسی وجود کد ملی تکراری در مدل لیگ
    const existingGradeStudent = await GradeStudent.findOne({ nationalId: trimmedNationalId });
    if (existingGradeStudent) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموزی با این کد ملی از قبل در سیستم ثبت شده است." },
        { status: 400 }
      );
    }

    const newStudent = await GradeStudent.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalId: trimmedNationalId,
      grade: Number(grade),
      totalScore: 0,
      selectedActivities: [],
      published: true,
    });

    return NextResponse.json({
      success: true,
      data: newStudent,
    }, { status: 201 });
  } catch (err: any) {
    console.error("Error in POST:", err);
    // اگر خطای خط قید یکتا (Duplicate Key) از سمت MongoDB رخ داد
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموزی با این کد ملی از قبل در سیستم ثبت شده است." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "خطا در ثبت دانش‌آموز" },
      { status: 500 }
    );
  }
}

// ==================== PUT ====================
export async function PUT(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id, firstName, lastName, nationalId, grade, selectedActivities, addedScore } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه دانش‌آموز الزامی است" },
        { status: 400 }
      );
    }

    const student = await GradeStudent.findById(id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموز یافت نشد" },
        { status: 404 }
      );
    }

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData: any = {};

    // ویرایش اطلاعات
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (nationalId !== undefined) {
      const trimmedId = nationalId.trim();
      // بررسی تکراری نبودن کد ملی در صورت تغییر
      if (trimmedId !== student.nationalId) {
        const duplicateCheck = await GradeStudent.findOne({ nationalId: trimmedId });
        if (duplicateCheck) {
          return NextResponse.json(
            { success: false, error: "این کد ملی متعلق به دانش‌آموز دیگری است." },
            { status: 400 }
          );
        }
      }
      updateData.nationalId = trimmedId;
    }
    if (grade !== undefined) updateData.grade = Number(grade);

    // افزودن فعالیت‌های جدید (بدون جایگزینی)
    if (selectedActivities && Array.isArray(selectedActivities) && selectedActivities.length > 0) {
      const currentActivities = student.selectedActivities || [];
      const newActivities = selectedActivities.filter(
        (id: string) => !currentActivities.includes(id)
      );
      if (newActivities.length > 0) {
        updateData.selectedActivities = [...currentActivities, ...newActivities];
      }
    }

    // افزودن امتیاز به صورت تجمعی
    if (addedScore && addedScore !== 0) {
      updateData.totalScore = (student.totalScore || 0) + addedScore;
    }

    // اگر هیچ تغییری وجود نداشت
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        data: student,
        message: "هیچ تغییری اعمال نشد"
      });
    }

    const updated = await GradeStudent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    console.error("Error in PUT:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "این کد ملی تکراری است و قبلاً ثبت شده است." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "خطا در به‌روزرسانی" },
      { status: 500 }
    );
  }
}

// ==================== DELETE ====================
export async function DELETE(req: Request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه دانش‌آموز الزامی است" },
        { status: 400 }
      );
    }

    // ۱. پیدا کردن و حذف رکورد لیگ
    const deletedGradeStudent = await GradeStudent.findByIdAndDelete(id);

    if (!deletedGradeStudent) {
      return NextResponse.json(
        { success: false, error: "دانش‌آموز در لیگ یافت نشد" },
        { status: 404 }
      );
    }

    // ۲. پیدا کردن و حذف دانش‌آموز از مدل اصلی (Student)
    if (deletedGradeStudent.studentId) {
       await Student.findByIdAndDelete(deletedGradeStudent.studentId);
    } else {
      await Student.findOneAndDelete({ nationalId: deletedGradeStudent.nationalId });
    }

    return NextResponse.json({
      success: true,
      message: "دانش‌آموز از هر دو بخش با موفقیت حذف شد",
    });
  } catch (err) {
    console.error("Error in DELETE:", err);
    return NextResponse.json(
      { success: false, error: "خطا در حذف دانش‌آموز" },
      { status: 500 }
    );
  }
}

// ==================== PATCH ====================
export async function PATCH(req: Request) {
  await dbConnect();
  try {
    // ۱. ابتدا برای هر پایه، دانش‌آموزان را بر اساس امتیاز مرتب می‌کنیم تا رتبه فعلی آن‌ها مشخص شود
    const grades = [2, 3, 4, 5, 6, 7, 8, 9];
    
    for (const gradeNum of grades) {
      const studentsInGrade = await GradeStudent.find({ grade: gradeNum }).sort({ totalScore: -1 });
      
      // رتبه فعلی هر دانش‌آموز را به عنوان رتبه قبلی (previousRank) ذخیره می‌کنیم
      for (let i = 0; i < studentsInGrade.length; i++) {
        const student = studentsInGrade[i];
        const currentCalculatedRank = i + 1;
        
        // اگر هنوز previousRank تنظیم نشده، رتبه فعلی را به آن بدهیم تا اختلاف ناگهانی ایجاد نشود
        const oldRank = student.totalScore > 0 && student.previousRank ? student.previousRank : currentCalculatedRank;
        
        await GradeStudent.findByIdAndUpdate(student._id, {
          previousRank: oldRank, // ذخیره رتبه پیشین
          published: true
        });
      }
    }

    // ۲. ثبت زمان آخرین بروزرسانی در تنظیمات لیگ
    const now = new Date();
    await LeagueSetting.findOneAndUpdate(
      {},
      { lastUpdate: now },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "تمامی تغییرات با موفقیت منتشر شد و رتبه‌ها بروز شدند",
      lastUpdate: now.toISOString(),
    });
  } catch (err) {
    console.error("Error in PATCH:", err);
    return NextResponse.json(
      { success: false, error: "خطا در انتشار تغییرات" },
      { status: 500 }
    );
  }
}