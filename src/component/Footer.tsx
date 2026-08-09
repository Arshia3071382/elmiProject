import React from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import aparat from "./../../public/image/Aparat_Icon.png";
import rubika from "./../../public/image/Rubika_Icon.png";
import enamad from "./../../public/image/enamad-logo.png";

function Footer() {
  return (
    <div className="font-[iranSans-r] w-full">
      {/* Main blue section */}
      <div className="bg-primary w-full mt-20 rounded-t-[80px] md:rounded-t-[200px] pt-20 md:pt-24 pb-6 text-white relative overflow-hidden shadow-xl">
        <Container>
          {/* Desktop view */}
          <div
            className="hidden md:flex flex-col gap-8 w-full px-6 lg:px-16 text-right"
            dir="rtl"
          >
            {/* Top row */}
            <div className="grid grid-cols-3 gap-8 items-start w-full">
              {/* Quick access */}
              <div className="flex flex-col items-start">
                <h2 className="text-base font-bold mb-1">دسترسی سریع</h2>
                <div className="w-10 h-[2px] bg-white/30 mb-3" />
                <div className="text-sm space-y-2 text-gray-200">
                  <p>
                    <Link
                      href="/contactUs"
                      className="hover:text-blue-200 transition-colors font-semibold"
                    >
                      ارتباط با ما
                    </Link>
                  </p>
                  <p>
                    تماس: <span dir="ltr">۰۲۱-XXXXXXXX</span>
                  </p>
                  <p className="text-blue-200 text-xs">
                    ساعت کاری: شنبه تا چهارشنبه ۱۵ الی ۲۰
                  </p>
                </div>

                {/* Social media */}
                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href="https://web.rubika.ir/#c=c0BNeq5092020abb1a7cb6c37d532657"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image width={22} src={rubika} alt="روبیکا" />
                  </Link>
                  <Link
                    href="https://www.aparat.com/elmiMontazeran"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image width={22} src={aparat} alt="آپارات" />
                  </Link>
                </div>
              </div>

              {/* Scientific sections */}
              <div className="flex flex-col items-start">
                <h2 className="text-base font-bold mb-1">بخش‌های علمی</h2>
                <div className="w-10 h-[2px] bg-white/30 mb-3" />
                <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-2 text-gray-200">
                  <p>
                    <Link
                      href="/"
                      className="hover:text-blue-200 transition-colors"
                    >
                      صفحه اصلی
                    </Link>
                  </p>
                  <p>
                    <Link
                      href="/courses"
                      className="hover:text-blue-200 transition-colors"
                    >
                      دوره‌های آموزشی
                    </Link>
                  </p>
                  <p>
                    <Link
                      href="/aboutUs"
                      className="hover:text-blue-200 transition-colors"
                    >
                      درباره ما
                    </Link>
                  </p>
                  <p>
                    <Link
                      href="/elite-league"
                      className="text-amber-300 font-semibold hover:text-amber-400 transition-colors"
                    >
                      لیگ نخبگان
                    </Link>
                  </p>
                  <p className="col-span-2">
                    <Link
                      href="/notices"
                      className="hover:text-blue-200 transition-colors"
                    >
                      اخبار و اطلاعیه‌ها
                    </Link>
                  </p>
                </div>
              </div>

              {/* Location image and Enamad (desktop) */}
              <div className="flex items-start justify-end gap-6 w-full">
                <Link
                  href="https://nshn.ir/b2_bveVzYx4y9T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-40 h-24 rounded-xl overflow-hidden border border-white/10 shadow-lg block hover:opacity-90 transition-opacity relative group cursor-pointer"
                >
                  <img
                    src="/image/location.png"
                    alt="موقعیت مجموعه روی نقشه"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>

            {/* Address */}
            <div className="w-full pt-4 border-t border-white/10 text-center">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="font-bold text-white ml-2">نشانی مجموعه:</span>
                تهران، تقاطع خیابان کمیل و خوش، مسجد حضرت صاحب الزمان(عج)
              </p>
            </div>
          </div>

          {/* Mobile view */}
          <div className="flex md:hidden flex-col gap-6 px-6" dir="rtl">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10 text-right">
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold mb-1">دسترسی سریع</h2>
                  <div className="w-8 h-[2px] bg-white/30 mb-2" />
                  <div className="text-xs space-y-1.5 text-gray-300">
                    <p>
                      <Link
                        href="/contactUs"
                        className="font-semibold text-white"
                      >
                        ارتباط با ما
                      </Link>
                    </p>
                    <p>
                      تماس: <span dir="ltr">۰۲۱-XXXX</span>
                    </p>
                    <p className="text-blue-200 text-[11px]">
                      ساعت کاری: ۱۵ الی ۲۰
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Link href="https://rubika.ir/elmiMontazeran">
                    <Image width={20} src={rubika} alt="روبیکا" />
                  </Link>
                  <Link href="https://www.aparat.com/elmiMontazeran">
                    <Image width={20} src={aparat} alt="آپارات" />
                  </Link>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold mb-1">بخش‌های علمی</h2>
                <div className="w-8 h-[2px] bg-white/30 mb-2" />
                <div className="text-xs space-y-2 text-gray-300">
                  <p>
                    <Link href="/">صفحه اصلی</Link>
                  </p>
                  <p>
                    <Link href="/aboutUs">درباره ما</Link>
                  </p>
                  <p>
                    <Link href="/courses">دوره‌های آموزشی</Link>
                  </p>
                  <p>
                    <Link href="/elite-league" className="text-amber-300">
                      لیگ نخبگان
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile location */}
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-4">
              <Link
                href="https://nshn.ir/b2_bveVzYx4y9T"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 shadow-sm block relative cursor-pointer"
              >
                <img
                  src="/image/location.png"
                  alt="موقعیت مجموعه روی نقشه"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <p className="text-[11px] text-gray-300 text-center">
              نشانی: تهران، تقاطع خیابان کمیل و خوش، مسجد حضرت صاحب الزمان(عج)
            </p>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="bg-secondary w-full h-12 flex items-center justify-center">
        <h1 className="text-white text-center text-sm">
          کلیه حقوق محفوظ میباشد
        </h1>
      </div>
    </div>
  );
}

export default Footer;
