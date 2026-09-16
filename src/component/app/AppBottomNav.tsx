"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Bell,
  Sparkles,
  Headset,
  User,
  Pencil,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type TabType = "home" | "news" | "about" | "contact" | "login";

interface TabItem {
  id: TabType;
  label: string;
  href: string;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
  isCenter?: boolean;
}

interface AppBottomNavProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

/*
|--------------------------------------------------------------------------
| آیکون کتاب نقاشی / آموزشی
|--------------------------------------------------------------------------
| ترکیب کتاب باز + مداد
| برای اینکه حس یک آیکون اختصاصی‌تر داشته باشد.
*/

function DrawingBookIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* کتاب */}
      <BookOpen className="w-6 h-6 stroke-[2.1]" />

      {/* مداد کوچک */}
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
}: AppBottomNavProps) {
  const pathname = usePathname();

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
      activeIcon: Home,
      isCenter: true,
    },
    {
      id: "contact",
      label: "ارتباط با ما",
      href: "/contactUs",
      icon: Headset,
    },
    {
      id: "login",
      label: "ورود",
      href: "/auth/login",
      icon: User,
    },
  ];

  const getIsActive = (tab: TabItem) => {
    if (activeTab) {
      return activeTab === tab.id;
    }

    if (tab.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(tab.href);
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
        {/* =====================================================
            Bottom Navigation
        ===================================================== */}

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
            const ActiveIcon = tab.activeIcon || tab.icon;
            const isActive = getIsActive(tab);

            /* =================================================
               CENTER BUTTON
            ================================================= */

            if (tab.isCenter) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => onTabChange?.(tab.id)}
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
                  {/* دایره اصلی */}
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
                      {/* =================================================
                          Transition بین:
                          خانه ↔ کتاب نقاشی
                      ================================================= */}

                      <AnimatePresence mode="wait" initial={false}>
                        {isActive ? (
                          /* -----------------------------
                             حالت فعال: خانه
                          ----------------------------- */

                          <motion.div
                            key="active-home"
                            initial={{
                              scale: 0.55,
                              rotate: -20,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              rotate: 0,
                              opacity: 1,
                            }}
                            exit={{
                              scale: 0.7,
                              rotate: 20,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <ActiveIcon
                              className="
                                w-6
                                h-6
                                stroke-[2.2]
                              "
                            />
                          </motion.div>
                        ) : (
                          /* -----------------------------
                             حالت غیرفعال:
                             کتاب + مداد
                          ----------------------------- */

                          <motion.div
                            key="drawing-book"
                            initial={{
                              scale: 0.55,
                              rotate: 12,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              rotate: 0,
                              opacity: 1,
                            }}
                            exit={{
                              scale: 0.7,
                              rotate: -12,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <DrawingBookIcon />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* عنوان */}
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

            /* =================================================
               OTHER ITEMS
            ================================================= */

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => onTabChange?.(tab.id)}
                className="
                  flex-1
                  flex
                  flex-col
                  items-center
                  justify-center
                  h-full
                  pt-1
                  transition-all
                  duration-200
                  active:scale-90
                "
              >
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
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
