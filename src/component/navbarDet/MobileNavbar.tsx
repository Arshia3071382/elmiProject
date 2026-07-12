"use client";

import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

interface MobileNavbarProps {
  logo: StaticImageData;
  showLogo: boolean;
  showCourses: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileNavbar({
  logo,
  showLogo,
  showCourses,
  isOpen,
  setIsOpen,
}: MobileNavbarProps) {
  return (
    // Responsive layout for tablets and mobile devices
    <div className="flex lg:hidden justify-between items-center w-full h-40 px-4 relative">
      <div className="absolute top-20 left-0 right-0 mx-4 rounded shadow flex flex-row-reverse justify-between bg-white items-center h-25 px-4">
        
        {/* Toggle button for sidebar drawer */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center gap-1.5 w-8 h-8 cursor-pointer text-gray-600 order-first flex-shrink-0"
          aria-label="منو"
        >
          <span className={`h-0.5 w-6 bg-gray-600 rounded transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`h-0.5 w-6 bg-gray-600 rounded transition-opacity ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-gray-600 rounded transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Center-aligned brand logo */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 -mt-1 flex-shrink-0"
          style={{ opacity: showLogo ? 1 : 0 }}
        >
          <Link href="/">
            <Image width={85} src={logo} alt="sitelogo" priority />
          </Link>
        </div>

        {/* بخش دکمه‌ها در حالت موبایل: کاملاً زیر هم، هم‌اندازه و بدون شکستن متن */}
        <div className="flex flex-col items-stretch gap-1.5 py-1.5 order-last min-w-[90px] flex-shrink-0">
          
          {/* دکمه اول: لیگ نخبگان */}
          <Link href="/elite-league" className="w-full">
            <button
              className="w-full group rounded cursor-pointer text-amber-600 border border-amber-500 py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-1 font-[iranSans-r] text-[11px] whitespace-nowrap"
              style={{
                opacity: showCourses ? 1 : 0,
                transition: "opacity 0.5s ease-out",
              }}
            >
              <span>لیگ نخبگان</span>
            </button>
          </Link>

          {/* دکمه دوم: دوره‌ها */}
          <Link href="/courses" className="w-full">
            <button
              className="w-full rounded cursor-pointer text-white py-1 px-2 bg-accent hover:bg-opacity-90 transition-all duration-300 text-center font-[iranSans-r] text-[11px] whitespace-nowrap"
              style={{
                opacity: showCourses ? 1 : 0,
                transition: "opacity 0.5s ease-out",
              }}
            >
              دوره‌ها
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}