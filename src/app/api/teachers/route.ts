import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Teacher from "../../../../models/Teacher";

export async function GET() {
  try {
    await dbConnect();

    const teachers = await Teacher.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: teachers,
    });
  } catch (error: any) {
    console.error("GET /api/teachers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت اطلاعات دبیران",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const newTeacher = await Teacher.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newTeacher,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST /api/teachers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "خطا در ایجاد دبیر",
      },
      { status: 400 },
    );
  }
}
