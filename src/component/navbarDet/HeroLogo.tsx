"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

import logotype from "./../../../public/image/logo-type-removebg-preview.png";

interface HeroLogoProps {
  logo: StaticImageData;
}

export default function HeroLogo({ logo }: HeroLogoProps) {
  const { scrollY } = useScroll();

  const [showTypography, setShowTypography] = useState(false);

  // =========================================================
  // اندازه لوگو هنگام Scroll
  // =========================================================

  const rawLogoSize = useTransform(scrollY, [0, 60], [76, 54]);

  const logoSize = useSpring(rawLogoSize, {
    stiffness: 300,
    damping: 28,
    mass: 0.7,
  });

  // =========================================================
  // چرخه زمانی جدید: لوگو (۷ ثانیه) → تایپوگرافی (۴ ثانیه)
  // =========================================================

  useEffect(() => {
    let logoTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;

    const startCycle = () => {
      setShowTypography(false);

      // پس از ۷ ثانیه ماندگاری لوگو، رفتن به تایپوگرافی
      logoTimer = setTimeout(() => {
        setShowTypography(true);

        // پس از ۴ ثانیه ماندگاری تایپوگرافی، تکرار چرخه
        cycleTimer = setTimeout(() => {
          startCycle();
        }, 4000); // ۴ ثانیه ماندگاری تایپوگرافی
      }, 7000); // ۷ ثانیه ماندگاری لوگو
    };

    startCycle();

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(cycleTimer);
    };
  }, []);

  return (
    <div
      className="
        absolute
        left-1/2
        top-1/2
        z-20
        -translate-x-1/2
        -translate-y-1/2
        flex
        items-center
        justify-center
      "
    >
      <Link
        href="/"
        aria-label="صفحه اصلی علمی منتظران"
        className="
          relative
          flex
          items-center
          justify-center
        "
      >
        <AnimatePresence mode="wait">
          {/* =====================================================
              MAIN LOGO (نمایش ۷ ثانیه با چرخش سریع در ثانیه دوم)
          ===================================================== */}

          {!showTypography && (
            <motion.div
              key="main-logo"
              initial={{
                opacity: 0,
                scale: 0.72,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(5px)",
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                flex
                items-center
                justify-center
                [perspective:1000px]
              "
            >
              {/* Glow بسیار ظریف پشت لوگو */}
              <motion.div
                animate={{
                  opacity: [0.12, 0.24, 0.12],
                  scale: [0.9, 1.04, 0.9],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-blue-400/20
                  blur-xl
                "
              />

              {/* لوگوی اصلی */}
              <motion.div
                style={{
                  width: logoSize,
                  height: logoSize,
                }}
                animate={{
                  y: [0, -3, 0, 2, 0],
                  // چرخش سریع در ثانیه دوم
                  rotateY: [0, 0, 360, 360],
                }}
                transition={{
                  y: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotateY: {
                    duration: 2.7,
                    times: [0, 0.7, 0.95, 1],
                    ease: [0.25, 1, 0.5, 1],
                  },
                }}
                className="
                  relative
                  flex
                  items-center
                  justify-center
                  [transform-style:preserve-3d]
                "
              >
                <Image
                  src={logo}
                  alt="لوگوی علمی منتظران"
                  fill
                  sizes="76px"
                  priority
                  className="
                    object-contain
                    drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                  "
                />
              </motion.div>
            </motion.div>
          )}

          {/* =====================================================
              TYPOGRAPHY (نمایش ۴ ثانیه)
          ===================================================== */}

          {showTypography && (
            <motion.div
              key="typography"
              initial={{
                opacity: 0,
                scale: 0.96,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                filter: "blur(3px)",
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                flex
                items-center
                justify-center
                overflow-hidden
                h-[54px]
                w-[190px]
                sm:h-[60px]
                sm:w-[220px]
              "
            >
              <motion.div
                initial={{
                  clipPath: "inset(0 100% 0 0)",
                }}
                animate={{
                  clipPath: "inset(0 0% 0 0)",
                }}
                transition={{
                  duration: 2.0,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
              >
                <Image
                  src={logotype}
                  alt="علمی منتظران"
                  fill
                  priority
                  sizes="220px"
                  className="
                    object-contain
                    drop-shadow-[0_3px_10px_rgba(37,99,235,0.12)]
                  "
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
}
