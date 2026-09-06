import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!folder) {
      return NextResponse.json(
        {
          success: false,
          error: "لینک پوشه ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    const input = folder.trim();

    let bucketName = "";
    let folderPath = "";

    /*
     * حالت ۱:
     * لینک کامل Supabase
     *
     * https://xxx.supabase.co/storage/v1/object/public/Skills%20Class/Skills-Class
     */
    if (
      input.startsWith("http://") ||
      input.startsWith("https://")
    ) {
      try {
        const url = new URL(input);

        const marker = "/storage/v1/object/public/";

        const markerIndex = url.pathname.indexOf(marker);

        if (markerIndex === -1) {
          return NextResponse.json(
            {
              success: false,
              error: "لینک Supabase Storage معتبر نیست.",
            },
            { status: 400 }
          );
        }

        const storagePath = decodeURIComponent(
          url.pathname.substring(
            markerIndex + marker.length
          )
        );

        const parts = storagePath
          .split("/")
          .filter(Boolean);

        if (parts.length < 2) {
          return NextResponse.json(
            {
              success: false,
              error: "مسیر پوشه در لینک Supabase معتبر نیست.",
            },
            { status: 400 }
          );
        }

        bucketName = parts[0];
        folderPath = parts.slice(1).join("/");
      } catch (error) {
        console.error(
          "Invalid Supabase URL:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            error: "لینک Supabase معتبر نیست.",
          },
          { status: 400 }
        );
      }
    } else {
      /*
       * حالت ۲:
       * اگر فقط مسیر پوشه ارسال شده باشد
       *
       * bucket از ENV گرفته می‌شود.
       */
      bucketName =
        process.env.SUPABASE_BUCKET_NAME || "showcase";

      folderPath = input
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
    }

    if (!bucketName || !folderPath) {
      return NextResponse.json(
        {
          success: false,
          error: "Bucket یا مسیر پوشه مشخص نیست.",
        },
        { status: 400 }
      );
    }

    /*
     * جلوگیری از ورودی‌های نامعتبر
     */
    if (
      folderPath.includes("-2147") ||
      folderPath.includes("..")
    ) {
      return NextResponse.json(
        {
          success: true,
          images: [],
        },
        { status: 200 }
      );
    }

    console.log("📁 Supabase Showcase:");
    console.log("Bucket:", bucketName);
    console.log("Folder:", folderPath);

    /*
     * دریافت فایل‌های داخل پوشه
     */
    const { data: files, error: listError } =
      await supabase.storage
        .from(bucketName)
        .list(folderPath, {
          limit: 100,
          sortBy: {
            column: "created_at",
            order: "desc",
          },
        });

    if (listError) {
      console.error(
        "❌ Supabase Storage Error:",
        listError.message
      );

      return NextResponse.json(
        {
          success: false,
          error: listError.message,
        },
        { status: 500 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: true,
          images: [],
        },
        { status: 200 }
      );
    }

    /*
     * فقط فایل‌های تصویری
     */
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".avif",
      ".bmp",
      ".svg",
    ];

    const imageFiles = files.filter((file) => {
      if (!file.name) return false;

      if (
        file.name === ".emptyFolderPlaceholder"
      ) {
        return false;
      }

      const lowerName =
        file.name.toLowerCase();

      return imageExtensions.some((ext) =>
        lowerName.endsWith(ext)
      );
    });

    /*
     * تبدیل فایل‌ها به Public URL
     */
    const images = imageFiles.map((file) => {
      const filePath =
        `${folderPath}/${file.name}`;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return NextResponse.json(
      {
        success: true,
        bucket: bucketName,
        folder: folderPath,
        images,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "❌ /api/showcase/images error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "خطای سرور",
      },
      { status: 500 }
    );
  }
}