// src/lib/aparatUtils.ts

/**
 * این تابع هر نوع ورودی آپارات (کد کامل آی‌فریم، لینک معمولی یا لینک امبد) را دریافت کرده
 * و فقط لینک امبد تمیز و قابل استفاده در iframe را استخراج و تولید می‌کند.
 */
export function extractAparatEmbedUrl(input: string): string {
  if (!input) return "";
  
  const trimmedInput = input.trim();

  // حالت اول: اگر کاربر کد کامل iframe (کد اشتراک‌گذاری آپارات) را وارد کرده باشد
  if (trimmedInput.includes("<iframe") || trimmedInput.includes("<div")) {
    const iframeSrcMatch = trimmedInput.match(/<iframe[^>]*\bsrc=["']([^"']+)["']/i);
    if (iframeSrcMatch && iframeSrcMatch[1]) {
      // بازگشت لینک استخراج شده از داخل تگ src
      return iframeSrcMatch[1].trim();
    }
  }

  // حالت دوم: اگر کاربر لینک مستقیم امبد آپارات را وارد کرده باشد
  // نمونه: https://www.aparat.com/video/video/embed/videohash/xbxfpy7/vt/frame
  if (trimmedInput.includes("aparat.com/video/video/embed")) {
    return trimmedInput;
  }

  // حالت سوم: اگر کاربر لینک معمولی تماشای ویدیو را وارد کرده باشد
  // نمونه ۱: https://www.aparat.com/v/xbxfpy7
  // نمونه ۲: https://www.aparat.com/v/xbxfpy7?refererRef=channel_page#video-more-embed
  const regularLinkMatch = trimmedInput.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/i);
  if (regularLinkMatch && regularLinkMatch[1]) {
    const videoHash = regularLinkMatch[1];
    return `https://www.aparat.com/video/video/embed/videohash/${videoHash}/vt/frame`;
  }

  // اگر فرمت متفاوتی بود ولی همچنان حاوی آدرس آپارات بود، خود ورودی را برمی‌گردانیم
  if (trimmedInput.startsWith("http") && trimmedInput.includes("aparat.com")) {
    return trimmedInput;
  }

  return "";
}