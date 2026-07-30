"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface HeroLogoProps {
  logo: StaticImageData;
}

export default function HeroLogo({ logo }: HeroLogoProps) {
  const { scrollY } = useScroll();

  // تبدیل متناسب اسکرول از 64px به 48px
  const rawLogoSize = useTransform(scrollY, [0, 60], [64, 48]);
  const logoSize = useSpring(rawLogoSize, { stiffness: 300, damping: 28 });

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 [perspective:1000px]">
      <Link href="/" aria-label="صفحه اصلی">
        <motion.div
          style={{ width: logoSize, height: logoSize }}
          animate={{
            y: [0, -3, 0],
            rotateY: [0, 4, -4, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center rounded-2xl border border-white/90 bg-gradient-to-b from-white/95 via-slate-50/80 to-blue-50/40 p-1.5 backdrop-blur-xl shadow-[0_10px_25px_-5px_rgba(30,58,138,0.18),inset_0_1px_2px_rgba(255,255,255,1)] [transform-style:preserve-3d]"
        >
          {/* نور پس‌زمینه ظریف */}
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-amber-400/20 via-blue-500/15 to-transparent blur-md pointer-events-none" />

          <div className="relative h-full w-full">
            <Image
              src={logo}
              alt="لوگو"
              fill
              sizes="64px"
              className="object-contain p-0.5 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              priority
            />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}