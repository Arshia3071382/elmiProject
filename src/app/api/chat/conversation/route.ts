import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

// خواندن فایل index برای پیدا کردن نام فایل
async function getTopicFile(slug: string): Promise<string | null> {
  try {
    const indexPath = path.join(DATA_DIR, "topics-index.json");
    const indexContent = await fs.readFile(indexPath, "utf-8");
    const topics = JSON.parse(indexContent);
    
    const topic = topics.find((t: any) => t.slug === slug);
    return topic ? topic.file : null;
  } catch (error) {
    console.error("❌ خطا در خواندن index:", error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("topic");
    const nodeSlug = searchParams.get("slug");

    console.log(`📡 [API] دریافت گام: topic=${slug}, node=${nodeSlug}`);

    if (!slug || !nodeSlug) {
      return NextResponse.json(
        { success: false, error: "پارامترهای topic و slug الزامی هستند" },
        { status: 400 }
      );
    }

    // پیدا کردن نام فایل از index
    const fileName = await getTopicFile(slug);
    if (!fileName) {
      console.log(`❌ [API] تاپیک "${slug}" یافت نشد`);
      return NextResponse.json(
        { success: false, error: `تاپیک "${slug}" یافت نشد` },
        { status: 404 }
      );
    }

    // خواندن فایل سناریو
    const filePath = path.join(DATA_DIR, fileName);
    console.log(`📂 [API] مسیر فایل: ${filePath}`);

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const scenarioData = JSON.parse(fileContent);
      
      console.log(`✅ [API] فایل خوانده شد، گام‌ها:`, Object.keys(scenarioData));
      
      // پیدا کردن گام
      const nodeData = scenarioData[nodeSlug];
      
      if (!nodeData) {
        console.log(`❌ [API] گام "${nodeSlug}" یافت نشد`);
        return NextResponse.json(
          { 
            success: false, 
            error: `گام "${nodeSlug}" در سناریو یافت نشد` 
          },
          { status: 404 }
        );
      }

      console.log(`✅ [API] گام "${nodeSlug}" با ${nodeData.messages?.length || 0} پیام و ${nodeData.choices?.length || 0} انتخاب`);

      return NextResponse.json({
        success: true,
        data: {
          messages: nodeData.messages || [],
          choices: nodeData.choices || [],
          title: nodeData.title || nodeSlug,
        }
      });
      
    } catch (fileError: any) {
      console.error(`❌ [API] خطا در خواندن فایل:`, fileError);
      
      if (fileError.code === 'ENOENT') {
        return NextResponse.json(
          { 
            success: false, 
            error: `فایل سناریو "${fileName}" یافت نشد` 
          },
          { status: 404 }
        );
      }
      throw fileError;
    }
  } catch (error: any) {
    console.error("❌ [API] خطا:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}