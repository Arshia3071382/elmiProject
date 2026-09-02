import Image from "next/image";
import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 text-center font-sans" dir="rtl">
      <div className="max-w-xl w-full bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col items-center">
        
        {/* تصویر لگویی با ارتفاع بهینه‌شده برای موبایل */}
        <div className="relative w-full h-52 sm:h-72 mb-5 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-slate-100">
          <Image
            src="/image/c1.png"
            alt="برنامه نویسان مشغول کارند"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* برچسب طنز وضعیت */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-100 text-amber-800 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-amber-200">
          <span>⚠️</span>
          <span>پروژه تحت کلنگ‌زنی تیم فنی!</span>
        </div>

        {/* عنوان */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-800 mb-2 sm:mb-3">
          برنامه‌نویسان مشغول کارند!
        </h1>

        {/* متن کوتاه */}
        <p className="text-slate-600 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg px-2">
          صفحه مربوطه در حال ساخت می‌باشد و به زودی تکمیل می‌شود. لطفا کلاه ایمنی خود را بگذارید!
        </p>

        {/* دکمه بازگشت */}
        <Link
          href="/"
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base text-center"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}