"use client";

import Link from "next/link";

interface ResponsiveDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ResponsiveDrawer({ isOpen, setIsOpen }: ResponsiveDrawerProps) {
  return (
    // Backdrop overlay for mobile menu drawer
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 lg:hidden ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsOpen(false)}
    >
      {/* Sliding sidebar box */}
      <div
        className={`bg-white w-64 h-full pt-28 px-6 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col gap-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } mr-auto`}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <ul className="flex flex-col gap-5 font-[iranSans-r] text-[16px] text-gray-600">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <li className="hover:bg-secondary/10 hover:text-secondary p-2.5 rounded transition-colors">
              صفحه اصلی
            </li>
          </Link>
          <Link href="/aboutUs" onClick={() => setIsOpen(false)}>
            <li className="hover:bg-secondary/10 hover:text-secondary p-2.5 rounded transition-colors">
              درباره ما
            </li>
          </Link>
          <Link href="/contactUs" onClick={() => setIsOpen(false)}>
            <li className="hover:bg-secondary/10 hover:text-secondary p-2.5 rounded transition-colors">
              ارتباط با ما
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}