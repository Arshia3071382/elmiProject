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
          className="flex flex-col justify-center items-center gap-1.5 w-8 h-8 cursor-pointer text-gray-600 order-first"
          aria-label="منو"
        >
          <span className={`h-0.5 w-6 bg-gray-600 rounded transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`h-0.5 w-6 bg-gray-600 rounded transition-opacity ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-gray-600 rounded transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Center-aligned brand logo */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 -mt-1"
          style={{ opacity: showLogo ? 1 : 0 }}
        >
          <Link href="/">
            <Image width={85} src={logo} alt="sitelogo" priority />
          </Link>
        </div>

        {/* Navigation action buttons group */}
        <div className="flex items-center gap-2 order-last">
          {/* News and announcements link */}
         

          {/* Direct link button to courses */}
          <Link href="/courses">
            <button
              className="rounded text-[11px] text-white py-2 px-2.5 bg-accent hover:bg-opacity-90 transition font-[iranSans-r]"
              style={{
                opacity: showCourses ? 1 : 0,
                transition: "opacity 0.5s ease-out",
              }}
            >
              دوره ها 
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}