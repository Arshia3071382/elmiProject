"use client";

import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

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
  
  // Combined condition to orchestrate the global menu animation trigger
  const animateMenu = showHome && showAbout && showContact;

  return (
    // Main desktop navbar wrapper
    <div className="hidden lg:flex justify-between items-center w-full h-40 relative">
      <div className="absolute top-25 left-1/2 -translate-x-1/2 rounded shadow flex flex-row-reverse w-5/6 justify-between bg-white items-center h-25 px-3">
        
        {/* Animated logo container */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? "translateX(0)" : "translateX(-30px)",
          }}
        >
          <Image width={119} src={logo} alt="sitelogo" />
        </div>

        {/* Menu navigation links */}
        <div className="flex flex-row-reverse items-center gap-10">
          <ul className="hidden md:flex flex-row-reverse gap-10 font-[iranSans-r] text-[16px] text-gray-500 cursor-pointer">
            
            {/* 1. Home Link - Immediate entry without delay */}
            <Link href="/">
              <li
                className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "0ms",
                }}
              >
                صفحه اصلی
              </li>
            </Link>

            {/* 2. Contact Us Link - Staggered by 100ms */}
            <Link href="/contactUs">
              <li
                className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "100ms",
                }}
              >
                ارتباط با ما
              </li>
            </Link>

            {/* 3. About Us Link - Staggered by 200ms */}
            <Link href="/aboutUs">
              <li
                className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "200ms",
                }}
              >
                درباره ما
              </li>
            </Link>

            {/* 4. Notices Link - Staggered by 300ms */}
            <Link href="/notices">
              <li 
                className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                style={{
                  opacity: animateMenu ? 1 : 0,
                  transform: animateMenu ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.5s ease-out",
                  transitionDelay: "300ms",
                }}
              >
                اخبار و اطلاعیه‌ها
              </li>
            </Link>
          </ul>
        </div>

        {/* Actions section */}
        <div className="gap-3 flex flex-row items-center">
          {/* 5. Courses Button - Final item in the staggered sequence */}
          <Link href="/courses">
            <button
              className="rounded cursor-pointer text-white p-2 bg-accent hover:bg-white hover:text-accent hover:border border-accent transition"
              style={{
                opacity: showCourses ? 1 : 0,
                transform: showCourses ? "translateX(0)" : "translateX(30px)",
                transition: "all 0.5s ease-out",
                transitionDelay: "400ms",
              }}
            >
              دوره های آموزشی
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}