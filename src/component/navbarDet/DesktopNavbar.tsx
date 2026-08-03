"use client";

import React, { useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  Variants,
} from "framer-motion";
import { Sparkles, Trophy, BookOpen, MessageCircle } from "lucide-react";
import SynapticCanvas from "./SynapticCanvas";
import Container from "../Container";

interface DesktopNavbarProps {
  logo: StaticImageData;
}

const MENU_ITEMS = [
  { label: "صفحه اصلی", href: "/" },
  { label: "اخبار و اطلاعیه‌ها", href: "/notices" },
  { label: "درباره ما", href: "/aboutUs" },
  { label: "ارتباط با ما", href: "/contactUs" },
];

export default function DesktopNavbar({ logo }: DesktopNavbarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const mouseX = useSpring(0, { stiffness: 220, damping: 28 });
  const mouseY = useSpring(0, { stiffness: 220, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const { scrollY } = useScroll();
  const rawHeight = useTransform(scrollY, [0, 100], [88, 70]);
  const rawRadius = useTransform(scrollY, [0, 100], [28, 20]);
  const rawY = useTransform(scrollY, [0, 100], [20, 10]);

  const navbarHeight = useSpring(rawHeight, { stiffness: 220, damping: 28 });
  const navbarRadius = useSpring(rawRadius, { stiffness: 220, damping: 28 });
  const navbarY = useSpring(rawY, { stiffness: 220, damping: 28 });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 320, damping: 24 },
    },
  };

  return (
    <motion.header
      style={{ y: navbarY }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed inset-x-0 top-0 z-50 hidden dir-rtl lg:block"
      dir="rtl"
    >
      <Container>
        <motion.nav
          ref={navRef}
          onMouseMove={handleMouseMove}
          style={{
            height: navbarHeight,
            borderRadius: navbarRadius,
          }}
          className="group relative flex w-full items-center justify-between border border-white/80 bg-white/75 px-7 backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.05),0_1px_2px_0_rgba(255,255,255,0.9)_inset]"
        >
          <SynapticCanvas />

          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  450px circle at ${mouseX}px ${mouseY}px,
                  rgba(59, 130, 246, 0.08),
                  transparent 80%
                )
              `,
            }}
          />

          {/* ۱. سمت راست: لوگوی بزرگ‌تر و نمایان‌تر دسکتاپ (h-16 w-16) */}
          <motion.div variants={itemVariants} className="relative z-10 flex items-center">
            <Link href="/" aria-label="صفحه اصلی">
              <motion.div
                animate={{
                  y: [-3, 3, -3],
                  rotateZ: [-0.8, 0.8, -0.8],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.08,
                  rotateZ: 2,
                  y: -4,
                  transition: { type: "spring", stiffness: 350, damping: 18 },
                }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/90 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 p-2 shadow-[0_10px_25px_-4px_rgba(30,58,138,0.15),0_2px_4px_-1px_rgba(0,0,0,0.04),inset_0_2px_2px_rgba(255,255,255,1)]"
              >
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-amber-400/20 via-blue-400/15 to-transparent blur-md pointer-events-none" />

                <motion.div
                  animate={{
                    x: ["-150%", "200%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 7,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none rounded-2xl"
                />

                <Image
                  src={logo}
                  alt="لوگو"
                  width={50}
                  height={50}
                  className="relative z-10 h-12 w-12 object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
                  priority
                />

                <motion.div
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-1 -right-1 z-20"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ۲. مرکز: منو */}
          <motion.ul
            variants={itemVariants}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative z-10 flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-100/50 p-1.5 backdrop-blur-md"
          >
            {MENU_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;
              const isHovered = hoveredIndex === index;

              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={`relative z-10 block px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                      isActive ? "text-blue-900" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <motion.span
                      animate={{
                        y: isHovered ? -1 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="block"
                    >
                      {item.label}
                    </motion.span>
                  </Link>

                  {isActive && (
                    <motion.div
                      layoutId="activePillDesktop"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full border border-blue-200/80 bg-white shadow-[0_2px_8px_rgba(37,99,235,0.08)]"
                    />
                  )}

                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverPillDesktop"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-slate-200/60"
                    />
                  )}
                </li>
              );
            })}
          </motion.ul>

          {/* ۳. سمت چپ: دکمه‌های کنشی */}
          <motion.div variants={itemVariants} className="relative z-10 flex items-center gap-2.5">
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.04, y: -1.5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/90 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100/90"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                <span>دوره های آموزشی</span>
              </motion.button>
            </Link>

            <Link href="/elite-league">
              <motion.button
                whileHover={{ scale: 1.04, y: -1.5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-500 to-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-[0_4px_14px_rgba(245,158,11,0.22)] transition-all hover:shadow-[0_6px_20px_rgba(245,158,11,0.32)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Trophy className="h-3.5 w-3.5 text-slate-950" />
                <span>لیگ نخبگان</span>
              </motion.button>
            </Link>

            <Link href="/chat-guidance">
              <motion.button
                whileHover={{ scale: 1.05, y: -1.5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden flex items-center gap-2 rounded-xl border border-blue-400/60 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 px-4.5 py-2 text-xs font-bold text-white shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_8px_25px_rgba(37,99,235,0.42)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span>گفتینو</span>
                <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.nav>
      </Container>
    </motion.header>
  );
}