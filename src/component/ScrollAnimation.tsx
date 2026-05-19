"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function ScrollAnimation({ 
  children, 
  delay = 0, 
  direction = "up" 
}: ScrollAnimationProps) {
  const [ref, inView] = useInView({
    triggerOnce: true, // فقط یک بار انیمیشن اجرا بشه
    threshold: 0.1, // وقتی 10% المان مشخص شد
  });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay }}
    >
      {children}
    </motion.div>
  );
}