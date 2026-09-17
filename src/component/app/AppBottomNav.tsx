"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bell,
  Sparkles,
  Headset,
  User,
  Pencil,
  LucideIcon,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export type TabType = "home" | "news" | "about" | "contact" | "login" | "profile";

interface TabItem {
  id: TabType;
  label: string;
  href?: string;
  icon: LucideIcon;
  isCenter?: boolean;
}

interface AppBottomNavProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onOpenLoginModal?: () => void; // جهت باز کردن مودال ورود
}

function DrawingBookIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <BookOpen className="w-6 h-6 stroke-[2.1]" />
      <Pencil
        className="
          absolute
          -right-1
          -bottom-0.5
          w-[11px]
          h-[11px]
          stroke-[2.4]
          rotate-[-18deg]
        "
      />
    </div>
  );
}

export default function AppBottomNav({
  activeTab,
  onTabChange,
  onOpenLoginModal,
}: AppBottomNavProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // بررسی وضعیت لاگین از localStorage
  const checkAuthStatus = () => {
    const studentPhone = localStorage.getItem("studentPhone");
    const studentNationalId = localStorage.getItem("studentNationalId");
    setIsLoggedIn(Boolean(studentPhone || studentNationalId));
  };

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const tabs: TabItem[] = [
    {
      id: "news",
      label: "اخبار",
      href: "/news",
      icon: Bell,
    },
    {
      id: "about",
      label: "درباره ما",
      href: "/aboutUs",
      icon: Sparkles,
    },
    {
      id: "home",
      label: "خانه",
      href: "/",
      icon: BookOpen,
      isCenter: true,
    },
    {
      id: "contact",
      label: "ارتباط با ما",
      href: "/contactUs",
      icon: Headset,
    },
    ...(isLoggedIn
      ? [
          {
            id: "profile" as TabType,
            label: "پروفایل",
            href: "/student/dashboard",
            icon: UserCheck,
          },
        ]
      : [
          {
            id: "login" as TabType,
            label: "ورود",
            icon: User,
          },
        ]),
  ];

  const getIsActive = (tab: TabItem) => {
    if (activeTab) {
      return activeTab === tab.id;
    }

    if (tab.href === "/") {
      return pathname === "/";
    }

    if (tab.href) {
      return pathname.startsWith(tab.href);
    }

    return false;
  };

  const handleTabClick = (e: React.MouseEvent, tab: TabItem) => {
    onTabChange?.(tab.id);

    // صرفاً باز کردن مودال ورود اختصاصی
    if (tab.id === "login") {
      e.preventDefault();
      onOpenLoginModal?.();
    }
  };

  return (
    <div
      className="
        fixed
        bottom-3
        left-0
        right-0
        z-50
        pointer-events-none
        pb-[env(safe-area-inset-bottom)]
        px-4
      "
    >
      <div
        className="
          max-w-md
          mx-auto
          relative
          dir-rtl
          pointer-events-auto
        "
      >
        <nav
          className="
            relative
            bg-[#0d52b5]
            text-white
            rounded-3xl
            shadow-2xl
            shadow-blue-900/30
            px-2
            h-16
            flex
            items-center
            justify-between
            border
            border-blue-400/20
          "
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = getIsActive(tab);

            if (tab.isCenter) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href || "/"}
                  onClick={(e) => handleTabClick(e, tab)}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    relative
                    -top-3
                    group
                  "
                >
                  <div
                    className="
                      w-13
                      h-13
                      rounded-full
                      flex
                      items-center
                      justify-center
                      ring-4
                      ring-[#0d52b5]
                      shadow-lg
                      transition-all
                      duration-300
                    "
                  >
                    <div
                      className="
                        w-full
                        h-full
                        rounded-full
                        flex
                        items-center
                        justify-center
                        bg-white
                        text-[#0d52b5]
                        shadow-md
                        transition-all
                        duration-300
                        active:scale-90
                        group-hover:bg-blue-50
                      "
                    >
                      <motion.div
                        key="drawing-book-center"
                        animate={{ scale: isActive ? 1.08 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DrawingBookIcon />
                      </motion.div>
                    </div>
                  </div>

                  <span
                    className={`
                      text-[10px]
                      font-bold
                      mt-0.5
                      transition-colors
                      duration-300
                      ${isActive ? "text-white" : "text-blue-200"}
                    `}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }

            const Content = (
              <>
                <Icon
                  className={`
                    w-5
                    h-5
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "text-white scale-110 stroke-[2.2]"
                        : "text-blue-200/80 stroke-[1.75]"
                    }
                  `}
                />
                <span
                  className={`
                    text-[10px]
                    mt-1
                    transition-colors
                    duration-200
                    ${
                      isActive
                        ? "text-white font-bold"
                        : "text-blue-200/80 font-medium"
                    }
                  `}
                >
                  {tab.label}
                </span>
              </>
            );

            const commonClasses =
              "flex-1 flex flex-col items-center justify-center h-full pt-1 transition-all duration-200 active:scale-90 cursor-pointer";

            if (tab.href) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={(e) => handleTabClick(e, tab)}
                  className={commonClasses}
                >
                  {Content}
                </Link>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => handleTabClick(e, tab)}
                className={commonClasses}
              >
                {Content}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}