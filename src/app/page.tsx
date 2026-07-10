"use client";

import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import Footer from "@/component/Footer";
import HeroSec from "@/component/HeroSec";
import Navbar from "@/component/Navbar";
import Questions from "@/component/Questions";
import ScrollAnimation from "./../component/ScrollAnimation";
import CounterStats from "@/component/CounterStats"; // Import the new component
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero section with fade-in animation */}
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

      {/* Popular courses section with scroll animation */}
      <ScrollAnimation direction="up" delay={0.2}>
        <div>
          <PopularClasses />
        </div>
      </ScrollAnimation>

      {/* FAQ section with scroll animation */}
      <ScrollAnimation direction="up" delay={0.4}>
        <Questions />
      </ScrollAnimation>
    </>
  );
}