// src/app/api/admin/topics/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./../../../../../../lib/dbConnect";
import { Topic } from "./../../../../../../models/Topic";
import { validateConversationTree } from "./../../../../../../lib/validations/treeValidator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const topic = await Topic.findById(id).lean();

    if (!topic) {
      return NextResponse.json({ success: false, error: "تاپیک یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// بروزرسانی تاپیک و تمام نودهای آن
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const { title, slug, description, imageUrl, status, order, startNodeId, nodes } = body;

    // اعتبارسنجی درخت قبل از ذخیره در دیتابیس
    if (nodes && startNodeId) {
      const validationErrors = validateConversationTree(startNodeId, nodes);
      if (validationErrors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "ساختار درخت مکالمه دارای خطا است.",
            details: validationErrors,
          },
          { status: 422 }
        );
      }
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        description,
        imageUrl,
        status,
        order,
        startNodeId,
        nodes,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedTopic });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// حذف تاپیک
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    await Topic.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "تاپیک با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}