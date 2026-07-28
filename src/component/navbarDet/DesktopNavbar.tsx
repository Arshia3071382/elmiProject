"use client";

import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";
import Container from "./../Container";

interface DesktopNavbarProps {
  logo: StaticImageData;
  showLogo: boolean;
  showHome: boolean;
  showContact: boolean;
  showAbout: boolean;
  showCourses: boolean;
}

export default function DesktopNavbar({
  logo,
  showLogo,
  showHome,
  showContact,
  showAbout,
  showCourses,
}: DesktopNavbarProps) {
  const animateMenu = showHome && showAbout && showContact;

  return (
   
      <div className="hidden lg:flex justify-between items-center w-full h-40 relative">
         <Container>
        <div className="absolute top-25 left-1/2 -translate-x-1/2 rounded shadow flex flex-row-reverse w-full justify-between bg-white items-center h-25 px-3">
          
          {/* لوگوی سایت */}
          <div
            className="transition-all duration-700 ease-out flex-shrink-0"
            style={{
              opacity: showLogo ? 1 : 0,
              transform: showLogo ? "translateX(0)" : "translateX(-30px)",
            }}
          >
            <Image width={119} src={logo} alt="sitelogo" />
          </div>

          {/* منوی اصلی ناوبری */}
          <div className="flex flex-row-reverse items-center gap-10">
            <ul className="hidden md:flex flex-row-reverse gap-8 font-[iranSans-r] text-[16px] text-gray-500 cursor-pointer">
              <li
                className="hover:bg-secondary hover:text-white hover:rounded transition duration-200 whitespace-nowrap"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "0ms",
                }}
              >
                <Link href="/" className="block p-2">
                  صفحه اصلی
                </Link>
              </li>

              <li
                className="hover:bg-secondary hover:text-white hover:rounded transition duration-200 whitespace-nowrap"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "150ms",
                }}
              >
                <Link href="/contactUs" className="block p-2">
                  ارتباط با ما
                </Link>
              </li>

              <li
                className="hover:bg-secondary hover:text-white hover:rounded transition duration-200 whitespace-nowrap"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "225ms",
                }}
              >
                <Link href="/aboutUs" className="block p-2">
                  درباره ما
                </Link>
              </li>

              <li
                className="hover:bg-secondary hover:text-white hover:rounded transition duration-200 whitespace-nowrap"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "300ms",
                }}
              >
                <Link href="/notices" className="block p-2">
                  اخبار و اطلاعیه‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش دکمه‌های عملیاتی (CTA) */}
          <div className="flex flex-col @2xl:flex-col min-[2000px]:flex-row items-stretch min-[2000px]:items-center gap-1.5 py-1.5 flex-shrink-0">
            
            {/* دکمه گفتینو */}
            <Link href="/chat-guidance" className="w-full">
              <button
                className="w-full rounded cursor-pointer text-white py-1 px-2.5 bg-accent hover:bg-opacity-90 border border-transparent transition-all duration-300 text-center flex items-center justify-center gap-1 font-[iranSans-r] text-[12px] min-[2000px]:text-[14px] whitespace-nowrap"
                style={{
                  opacity: showCourses ? 1 : 0,
                  transform: showCourses ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "350ms",
                }}
              >
                <span>گفتینو 💬</span>
              </button>
            </Link>

            {/* دکمه لیگ نخبگان */}
            <Link href="/elite-league" className="w-full">
              <button
                className="w-full group rounded cursor-pointer text-amber-600 border border-amber-500 py-1 px-2.5 bg-amber-50 hover:bg-amber-500 hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-1 font-[iranSans-r] text-[12px] min-[2000px]:text-[14px] whitespace-nowrap"
                style={{
                  opacity: showCourses ? 1 : 0,
                  transform: showCourses ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "425ms",
                }}
              >
                <svg
                  className="w-3.5 h-3.5 text-amber-500 group-hover:text-white group-hover:rotate-12 transition-transform duration-300 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span>لیگ نخبگان</span>
              </button>
            </Link>

            {/* دکمه دوره‌های آموزشی */}
            <Link href="/courses" className="w-full">
              <button
                className="w-full rounded cursor-pointer text-gray-700 border border-gray-300 py-1 px-2.5 bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-center font-[iranSans-r] text-[12px] min-[2000px]:text-[14px] whitespace-nowrap"
                style={{
                  opacity: showCourses ? 1 : 0,
                  transform: showCourses ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "500ms",
                }}
              >
                دوره‌های آموزشی
              </button>
            </Link>

          </div>
        </div>
        </Container>
      </div>
    
  );
}