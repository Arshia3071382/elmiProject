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

  // تغییر ابعاد نرم هنگام اسکرول از 76px به 54px
  const rawLogoSize = useTransform(scrollY, [0, 60], [76, 54]);
  const logoSize = useSpring(rawLogoSize, { stiffness: 300, damping: 28 });

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 [perspective:1000px]">
      <Link href="/" aria-label="صفحه اصلی" className="block">
        <motion.div
          style={{ width: logoSize, height: logoSize }}
          animate={{ rotateY: [0, 360] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 5, // چرخش هر ۵ ثانیه یک‌بار
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center [transform-style:preserve-3d]"
        >
          <Image
            src={logo}
            alt="لوگو"
            fill
            sizes="76px"
            className="object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            priority
          />
        </motion.div>
      </Link>
    </div>
  );
}