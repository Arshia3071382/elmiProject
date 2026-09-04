"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Preloader from "@/component/Preloader";
import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import HeroSec from "@/component/HeroSec";
import Questions from "@/component/Questions";
import ScrollAnimation from "./../component/ScrollAnimation";
import CounterStats from "@/component/CounterStats"; 
import ScienceHub from "@/component/ScienceHub";
import PuzzleActionSection from "@/component/PuzzleButton";
import StudentComments from "@/component/StudentComments";
import StudentAuthButtons from "@/component/auth/StudentAuthButtons";
import EliteLeagueBanner from "@/component/EliteLeagueBanner";
import MontazeranLink from "@/component/MontazeranLink";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSec isLoaded={isLoaded} />
        <StudentAuthButtons />
        <EliteLeagueBanner />
        <MontazeranLink />
        
        <ScrollAnimation direction="up" delay={0.1}>
          <CounterStats />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <ScienceHub />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <PuzzleActionSection />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <PopularClasses />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.35}>
          <StudentComments />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <Questions />
        </ScrollAnimation>
      </motion.div>
    </>
  );
}