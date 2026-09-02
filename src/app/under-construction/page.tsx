import Image from "next/image";
import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen mt-10 sm:mt-25 bg-white flex flex-col items-center justify-center p-6 text-center font-sans" dir="rtl">
      <div className="max-w-2xl w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center">
        
        {/* تصویر لگویی */}
        <div className="relative w-full h-72 sm:h-80 mb-6 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
          <Image
            src="/image/n1.jpg" // مسیر تصویر خود را اینجا قرار دهید یا نام دلخواه بگویید
            alt="برنامه نویسان مشغول کارند"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* برچسب طنز وضعیت */}
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-amber-200">
          <span>⚠️</span>
          <span>پروژه تحت کلنگ‌زنی تیم فنی!</span>
        </div>

        {/* عنوان */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">
          برنامه‌نویسان مشغول کارند!
        </h1>

        {/* متن کوتاه درخواستی */}
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
          صفحه مربوطه در حال ساخت می‌باشد و به زودی تکمیل می‌شود. لطفا کلاه ایمنی خود را بگذارید!
        </p>

        {/* دکمه بازگشت */}
        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}