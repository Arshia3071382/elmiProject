"use client";

import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import HeroSec from "@/component/HeroSec";
import Questions from "@/component/Questions";
import ScrollAnimation from "./../component/ScrollAnimation";
import CounterStats from "@/component/CounterStats"; 
import ScienceHub from "@/component/ScienceHub";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSec />
      </motion.div>

      {/* CounterStats - خودش Container دارد */}
      <ScrollAnimation direction="up" delay={0.1}>
        <CounterStats />
      </ScrollAnimation>

      {/* ScienceHub - خودش Container دارد */}
      <ScrollAnimation direction="up" delay={0.2}>
        <ScienceHub />
      </ScrollAnimation>

      {/* PopularClasses - باید Container داشته باشد */}
      <ScrollAnimation direction="up" delay={0.3}>
        
          <PopularClasses />
        
      </ScrollAnimation>

      {/* Questions - باید Container داشته باشد */}
      <ScrollAnimation direction="up" delay={0.4}>
        
          <Questions />
        
      </ScrollAnimation>
    </>
  );
}