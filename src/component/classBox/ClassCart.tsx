"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";

interface ClassItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  sessionsText: string;
}

export default function ClassCart() {
  const cartItem: ClassItem[] = [
    {
      id: 1,
      title: "کلاس ریاضی هشتم",
      subtitle: "تسلط بر مفاهیم پایه و پیشرفته",
      image: "/image/r7.jpg",
      gradient: "from-blue-500 to-cyan-400",
      borderColor: "border-blue-200 group-hover:border-blue-400",
      textColor: "text-blue-600",
      sessionsText: "۳۲ جلسه برگزار شده"
    },
    {
      id: 2,
      title: "کلاس علوم نهم",
      subtitle: "آزمایشگاه و تحلیل هوشمند",
      image: "/image/2.jpg",
      gradient: "from-emerald-500 to-teal-400",
      borderColor: "border-emerald-200 group-hover:border-emerald-400",
      textColor: "text-emerald-600",
      sessionsText: "۱۵ جلسه برگزار شده"
    },
    {
      id: 3,
      title: "کارگاه مشاوره کنکور",
      subtitle: "برنامه‌ریزی دقیق و انگیزشی",
      image: "/image/r9.jpg",
      gradient: "from-emerald-500 to-teal-400",
      borderColor: "border-emerald-200 group-hover:border-emerald-400",
      textColor: "text-emerald-600",
      sessionsText: "۵ جلسه برگزار شده"
    },
    {
      id: 4,
      title: "آزمون جامع پایه هفتم",
      subtitle: "سنجش سطح و آمادگی کامل",
      image: "/image/az.jpg",
      gradient: "from-indigo-500 to-sky-400",
      borderColor: "border-indigo-200 group-hover:border-indigo-400",
      textColor: "text-indigo-600",
      sessionsText: "۱۰ جلسه برگزار شده"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
      {cartItem.map((item, index) => (
        <ClassCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function ClassCard({ item, index }: { item: ClassItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), { damping: 20, stiffness: 200 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      <div className="block h-full cursor-pointer">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => {
            setIsHovered(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          className={`group relative flex flex-col items-center bg-white/90 backdrop-blur-sm border-2 ${item.borderColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full`}
        >
          {/* Gradient Background Effect - Dimmed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isHovered ? 0.08 : 0,
              scale: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-2xl pointer-events-none`}
          />

          {/* Shine Effect */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={isHovered ? { x: "200%", opacity: [0, 0.1, 0] } : { x: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Image Container */}
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="transition-transform duration-700 group-hover:scale-110 object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </div>

          {/* Content - Centered */}
          <div className="p-5 flex flex-col items-center flex-grow w-full">
            <motion.div
              style={{
                transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
              }}
              className="flex-grow w-full text-center"
            >
              <h3 className="text-base font-[iranBold] text-primary mb-1 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary/70 line-clamp-2">
                {item.subtitle}
              </p>
            </motion.div>

            {/* Footer with Stats and Button - Centered */}
            <motion.div
              style={{
                transform: isHovered ? "translateZ(15px)" : "translateZ(0px)",
              }}
              className="mt-4 pt-4 border-t border-gray-100 w-full"
            >
              <div className="flex flex-col items-center gap-3">
                {/* Stats - Centered with full text */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-text-secondary">📚</span>
                  <span className="text-[10px] text-text-secondary font-medium">{item.sessionsText}</span>
                </div>

                {/* Bigger Button - Centered */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full max-w-[160px] px-6 py-2.5 rounded-full text-sm font-[iranBold] text-white bg-gradient-to-r ${item.gradient} shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  جزئیات
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.4 }}
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}