import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../lib/dbConnect";
import Notice from "./../../../../models/Notice";

function createSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}



export async function GET() {
  try {
    await dbConnect();

    const notices = await Notice.find({
      status: "published",
      publishAt: { $lte: new Date() },
    })
      .sort({
        isPinned: -1,
        priority: -1,
        publishAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت اطلاعیه‌ها",
      },
      {
        status: 500,
      },
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      title,
      slug,
      description,
      content,
      type,
      priority,
      image,
      attachment,
      tags,
      targetGrades,
      targetClasses,
      publishAt,
      expireAt,
      isPinned,
      status,
      createdBy,
      isReadRequired,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "عنوان و متن اطلاعیه الزامی است.",
        },
        {
          status: 400,
        },
      );
    }

    const finalSlug = slug ? createSlug(slug) : createSlug(title);

    const duplicate = await Notice.findOne({
      slug: finalSlug,
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug تکراری است.",
        },
        {
          status: 409,
        },
      );
    }

    const notice = await Notice.create({
      title,

      slug: finalSlug,

      description,

      content,

      type,

      priority,

      image,

      attachment,

      tags,

      targetGrades,

      targetClasses,

      publishAt,

      expireAt,

      isPinned,

      status,

      createdBy,

      isReadRequired,
    });

    return NextResponse.json({
      success: true,
      message: "اطلاعیه با موفقیت ثبت شد.",
      notice,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "خطا در ثبت اطلاعیه",
      },
      {
        status: 500,
      },
    );
  }
}
