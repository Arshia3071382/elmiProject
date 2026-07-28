"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { BookOpen, GraduationCap, Award, FileSpreadsheet } from "lucide-react";

interface ClassItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  borderColor: string;
}

export default function ClassCart() {
  const cartItem: ClassItem[] = [
    {
      id: 1,
      title: "کلاس ریاضی هشتم",
      subtitle: "تسلط بر مفاهیم پایه و پیشرفته",
      image: "/image/r7.jpg",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      gradient: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100 group-hover:bg-blue-200",
      borderColor: "border-blue-200 group-hover:border-blue-400"
    },
    {
      id: 2,
      title: "کلاس علوم نهم",
      subtitle: "آزمایشگاه و تحلیل هوشمند",
      image: "/image/2.jpg",
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      gradient: "from-emerald-500 to-teal-400",
      iconBg: "bg-emerald-100 group-hover:bg-emerald-200",
      borderColor: "border-emerald-200 group-hover:border-emerald-400"
    },
    {
      id: 3,
      title: "کارگاه مشاوره کنکور",
      subtitle: "برنامه‌ریزی دقیق و انگیزشی",
      image: "/image/r9.jpg",
      icon: <Award className="w-6 h-6 text-sky-600" />,
      gradient: "from-sky-500 to-blue-400",
      iconBg: "bg-sky-100 group-hover:bg-sky-200",
      borderColor: "border-sky-200 group-hover:border-sky-400"
    },
    {
      id: 4,
      title: "آزمون جامع پایه هفتم",
      subtitle: "سنجش سطح و آمادگی کامل",
      image: "/image/az.jpg",
      icon: <FileSpreadsheet className="w-6 h-6 text-indigo-600" />,
      gradient: "from-indigo-500 to-sky-400",
      iconBg: "bg-indigo-100 group-hover:bg-indigo-200",
      borderColor: "border-indigo-200 group-hover:border-indigo-400"
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      {cartItem.map((item, index) => (
        <ClassCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function ClassCard({ item, index }: { item: ClassItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
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
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div 
        onClick={() => setIsClicked(true)}
        className="block h-full cursor-pointer"
      >
        <motion.div
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
          className={`group relative flex flex-col items-center justify-between p-5 bg-white/80 backdrop-blur-sm border-2 ${item.borderColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center overflow-hidden h-full`}
        >
          {/* گرادیانت پشت کارت */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isHovered ? 0.15 : 0,
              scale: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-2xl pointer-events-none`}
          />

          <div className="w-full flex flex-col items-center">
            {/* تصویر کارت با حالت مدرن و گوشه‌های گرد */}
            <div className="overflow-hidden rounded-2xl w-full mb-4 relative aspect-[16/10]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="transition-transform duration-500 group-hover:scale-110 object-cover"
              />
            </div>

            {/* کادر رنگی آیکون اختصاصی با انیمیشن چرخش هنگام کلیک */}
            <motion.div
              style={{
                transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              }}
              animate={isClicked ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onAnimationComplete={() => setIsClicked(false)}
              className={`relative z-10 mb-3 p-3 ${item.iconBg} rounded-2xl border-2 ${item.borderColor} transition-all duration-300 flex items-center justify-center`}
            >
              {item.icon}
            </motion.div>

            {/* عنوان و زیرعنوان */}
            <h3 className="text-base font-[iranBold] text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-text-secondary/70 mb-5">
              {item.subtitle}
            </p>
          </div>

          {/* دکمه جزئیات */}
          <div className="w-full mt-auto">
            <div className="bg-accent w-full py-3 rounded-xl shadow opacity-90 group-hover:opacity-100 transition-all duration-300 text-center">
              <span className="font-[iranBold] text-white text-sm">
                جزئیات و ثبت‌نام
              </span>
            </div>
          </div>

          {/* خط تزئینی پایین کارت */}
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