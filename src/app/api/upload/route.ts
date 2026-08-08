import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "teachers_portraits";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "فایلی دریافت نشد" },
        { status: 400 },
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    // از یک آپلود پریست Unsigned که در کلودیناری ساخته‌اید استفاده کنید
    const uploadPreset =
      process.env.CLOUDINARY_UPLOAD_PRESET || "elmi_unsigned_preset";

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);
    cloudinaryFormData.append("folder", folder);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      },
    );

    const result = await cloudinaryRes.json();

    if (!cloudinaryRes.ok) {
      throw new Error(
        result.error?.message || "خطا در آپلود تصویر به کلودیناری",
      );
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در آپلود فایل" },
      { status: 500 },
    );
  }
}
