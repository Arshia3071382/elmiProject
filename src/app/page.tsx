"use client";

import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import Footer from "@/component/Footer";
import HeroSec from "@/component/HeroSec";
import Navbar from "@/component/Navbar";
import Questions from "@/component/Questions";
import ScrollAnimation from "./../component/ScrollAnimation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* هیرو سکشن با انیمیشن fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSec />
      </motion.div>

      {/* بخش دوره‌های محبوب با انیمیشن اسکرول */}
      <ScrollAnimation direction="up" delay={0.2}>
        <div>
          <PopularClasses />
        </div>
      </ScrollAnimation>

      {/* بخش سوالات متداول با انیمیشن اسکرول */}
      <ScrollAnimation direction="up" delay={0.4}>
        <Questions />
      </ScrollAnimation>
    </>
  );
}