"use client";

import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import HeroSec from "@/component/HeroSec";
import Questions from "@/component/Questions";
import ScrollAnimation from "./../component/ScrollAnimation";
import CounterStats from "@/component/CounterStats"; 
import CuriosityButton from "@/component/CuriosityButton";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSec />
      </motion.div>

      {/* Dynamic Persian counter statistics section */}
      <ScrollAnimation direction="up" delay={0.1}>
        <Container>
          <CounterStats />
        </Container>
      </ScrollAnimation>

      {/* دکمه ایستگاه کنجکاوی (شامل کانتینر درونی) */}
      <ScrollAnimation direction="up" delay={0.2}>
        <CuriosityButton />
      </ScrollAnimation>

      {/* Popular courses section */}
      <ScrollAnimation direction="up" delay={0.3}>
        <div>
          <PopularClasses />
        </div>
      </ScrollAnimation>

      {/* FAQ section */}
      <ScrollAnimation direction="up" delay={0.4}>
        <Questions />
      </ScrollAnimation>
    </>
  );
}