import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const TOPICS_INDEX_PATH = path.join(process.cwd(), "src", "data", "topics-index.json");

export async function GET() {
  try {
    console.log("📡 [API] دریافت لیست تاپیک‌ها");
    
    // خواندن فایل index
    const indexContent = await fs.readFile(TOPICS_INDEX_PATH, "utf-8");
    const topics = JSON.parse(indexContent);
    
    console.log(`✅ [API] ${topics.length} تاپیک یافت شد`);
    
    return NextResponse.json({ 
      success: true, 
      data: topics 
    });
  } catch (error: any) {
    console.error("❌ [API] خطا در دریافت تاپیک‌ها:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}