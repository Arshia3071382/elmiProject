'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// لیست حقایق علمی جذاب
const scienceFacts = [
  "سرعت نور حدود ۲۹۹,۷۹۲ کیلومتر بر ثانیه است؛ یعنی نور خورشید دقیقاً ۸ دقیقه و ۲۰ ثانیه طول می‌کشد تا به زمین برسد.",
  "اگر تمام فضای خالی بین اتم‌های بدن تمام انسان‌های روی زمین را حذف کنیم، کل بشریت در یک حبه قند جای می‌گیرد!",
  "یک روز در سیاره زهره طولانی‌تر از یک سال در همان سیاره است؛ چون چرخش آن به دور خودش بسیار کندتر از چرخش به دور خورشید است.",
  "شباهت ساختار ژنتیکی (DNA) انسان با موز حدود ۵۰ درصد است!",
  "تعداد ستاره‌های قابل مشاهده در کل جهان، بیشتر از مجموع تمام دانه‌های شن روی تمام سواحل و بیابان‌های کره زمین است.",
  "ابرها بسیار سنگین‌تر از ظاهر شناورشان هستند؛ یک ابر کومولوس متوسط حدود ۵۰۰ تن وزن دارد!",
  "اگر چشمان انسان یک دوربین دیجیتال بود، رزولوشنی معادل ۵۷۶ مگاپیکسل داشت.",
  "در مجاورت سیاه‌چاله‌ها به دلیل گرانش فوق‌العاده شدید، زمان به شدت کندتر می‌گذرد.",
  "در سیارات نپتون و اورانوس، به دلیل فشار فوق‌العاده بالا و وجود کربن، باران الماس می‌بارد!",
  "تمام عناصر سنگین‌تر از هیدروژن و هلیوم در بدن شما، در دل ستاره‌های منفجرشده ساخته شده‌اند.",
  "اختاپوس‌ها دارای ۳ قلب مجزا و خونی به رنگ آبی روشن هستند.",
  "باکتری‌های موجود در بدن انسان از نظر تعدادی، تقریباً برابر با مجموع سلول‌های انسانی بدن خود ما هستند!",
  "دمای مرکز کره زمین حدود ۶۰۰۰ درجه سانتی‌گراد است که تقریباً با دمای سطح خورشید برابری می‌کند.",
  "یک سال نوری فاصله‌ای است که نور در یک سال طی می‌کند و معادل حدود ۹.۴۶ تریلیون کیلومتر است.",
  "مغز انسان حدود ۲۰ درصد از کل انرژی و اکسیژن مصرفی بدن را استفاده می‌کند."
];

export default function NotFound() {
  const [fact, setFact] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // دریافت حقیقت علمی تصادفی
  const getRandomFact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * scienceFacts.length);
      setFact(scienceFacts[randomIndex]);
      setIsAnimating(false);
    }, 200);
  };

  useEffect(() => {
    getRandomFact();
  }, []);

  return (
    <div className="min-h-screen mt-10 sm:mt-30 flex flex-col justify-between bg-bg text-text-primary font-['iranSans-r']" dir="rtl">
      
     

      {/* محتوای اصلی */}
      <main className="my-auto px-4 py-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        
        {/* ۱. متن طنز اول قرار گرفت */}
        <h1 className="text-3xl sm:text-4xl font-['iranBold'] text-primary mb-2">
          گشتم نبود، نگرد نیست!
        </h1>
        <p className="text-text-secondary text-sm sm:text-base mb-4 font-['iranSans-r']">
          صفحه مورد نظر شما پیدا نشد یا آدرس آن تغییر کرده است.
        </p>

        {/* ۲. عدد 404 در زیر متن قرار گرفت */}
        <span className="text-8xl sm:text-9xl font-['iranBold'] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary mb-8 select-none">
          404
        </span>

        {/* ۳. کارت آیا می‌دانستید؟ */}
        <div className="w-full bg-surface border border-border rounded-2xl p-6 sm:p-7 text-right shadow-sm mb-8 relative overflow-hidden">
          {/* نوار رنگی بالای کارت */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-secondary to-accent"></div>

          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <h2 className="font-['iranBold'] text-primary text-base sm:text-lg">
                آیا می‌دانستید؟
              </h2>
            </div>

            <button 
              onClick={getRandomFact}
              className="text-xs sm:text-sm font-['iranSans-r'] text-secondary hover:text-primary bg-bg hover:bg-border/50 px-3 py-1.5 rounded-lg border border-border transition-all active:scale-95 flex items-center gap-1"
            >
              <span>🔄</span>
              <span>یک حقیقت دیگه</span>
            </button>
          </div>

          <div className={`transition-opacity duration-200 min-h-[50px] flex items-center ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-['iranSans-r']">
              {fact}
            </p>
          </div>
        </div>

        {/* ۴. دکمه بازگشت تنها */}
        <Link 
          href="/" 
          className="bg-secondary hover:bg-primary text-text-invert font-['iranBold'] px-8 py-3.5 rounded-xl shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 text-sm"
        >
          بازگشت به صفحه اصلی
        </Link>

      </main>

      {/* فوتر */}
      <footer className="w-full text-center py-5 text-xs text-text-secondary border-t border-border font-['iranSans-r']">
        <p>تمامی حقوق محفوظ است © مجله علمی</p>
      </footer>

    </div>
  );
}