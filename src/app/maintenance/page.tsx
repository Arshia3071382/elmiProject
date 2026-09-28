"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ServerMaintenancePage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-white mt-10 sm:mt-25 flex flex-col items-center justify-center p-4 sm:p-6 text-center font-sans" dir="rtl">
      <div className="max-w-xl w-full bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col items-center">
        
        {/* تصویر لِگوی تعمیرات سرور با تضمین نمایش */}
        <div className="relative w-full h-56 sm:h-80 mb-5 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-900 flex items-center justify-center">
          {!imgError ? (
            <Image
              src="/image/c2.jpg"
              alt="قطعی سرور و بروزرسانی"
              fill
              unoptimized // برای جلوگیری از خطاهای پردازش تصویر در زمان مشکلات سرور
              className="object-contain"
              priority
              onError={() => setImgError(true)} // اگر به هر دلیلی عکس لود نشد، حالت جایگزین فعال شود
            />
          ) : (
            // حالت جایگزین در صورت لود نشدن عکس اصلی
            <div className="flex flex-col items-center justify-center text-slate-400 p-4">
              <span className="text-5xl mb-2">🛠️</span>
              <span className="text-sm font-medium">در حال تعمیر و بروزرسانی سرور</span>
            </div>
          )}
        </div>

        {/* برچسب هشدار قطعی سرور */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-100 text-red-800 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-red-200">
          <span>⚠️</span>
          <span>قطعی موقت و بروزرسانی سرور!</span>
        </div>

        {/* عنوان */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-800 mb-2 sm:mb-3">
          سرور در حال بروزرسانی است...
        </h1>

        {/* متن توضیحات */}
        <p className="text-slate-600 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg px-2">
          تیم فنی در حال ارتقا و بهینه‌سازی زیرساخت‌های سایت است. لطفاً کمی صبور باشید؛ به زودی با امکانات و سرعت بیشتری بازخواهیم گشت!
        </p>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md text-sm sm:text-base text-center cursor-pointer"
          >
            تلاش مجدد (بروزرسانی صفحه)
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md text-sm sm:text-base text-center"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}