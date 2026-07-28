"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Container from "@/component/Container";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { 
  Compass, 
  Radio, 
  Film, 
  CalendarDays, 
  FileCheck2, 
  Users,
  ArrowUpRight
} from "lucide-react";

interface HubItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  iconBg: string;
  borderColor: string;
}

export default function ScienceHub() {
  const hubItems: HubItem[] = [
    { 
      id: 1, 
      title: "ایستگاه کنجکاوی", 
      subtitle: "کاوش در ناشناخته‌ها",
      icon: <Compass className="w-6 h-6 text-blue-600" />, 
      href: "/curiosity",
      gradient: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100 group-hover:bg-blue-200",
      borderColor: "border-blue-200 group-hover:border-blue-400"
    },
    { 
      id: 2, 
      title: "پخش زنده", 
      subtitle: "لحظات علمی ناب",
      icon: <Radio className="w-6 h-6 text-emerald-600" />, 
      href: "/live",
      gradient: "from-emerald-500 to-teal-400",
      iconBg: "bg-emerald-100 group-hover:bg-emerald-200",
      borderColor: "border-emerald-200 group-hover:border-emerald-400"
    },
    { 
      id: 3, 
      title: "ویترین علم", 
      subtitle: "تماشای شگفتی‌ها",
      icon: <Film className="w-6 h-6 text-sky-600" />, 
      href: "/media",
      gradient: "from-sky-500 to-blue-400",
      iconBg: "bg-sky-100 group-hover:bg-sky-200",
      borderColor: "border-sky-200 group-hover:border-sky-400"
    },
    { 
      id: 4, 
      title: "گاهی‌شمار نخبگان", 
      subtitle: "رویدادهای پیش رو",
      icon: <CalendarDays className="w-6 h-6 text-teal-600" />, 
      href: "/calendar",
      gradient: "from-teal-500 to-emerald-400",
      iconBg: "bg-teal-100 group-hover:bg-teal-200",
      borderColor: "border-teal-200 group-hover:border-teal-400"
    },
    { 
      id: 5, 
      title: "آزمون جامع", 
      subtitle: "سنجش توانمندی",
      icon: <FileCheck2 className="w-6 h-6 text-indigo-600" />, 
      href: "/exams",
      gradient: "from-indigo-500 to-sky-400",
      iconBg: "bg-indigo-100 group-hover:bg-indigo-200",
      borderColor: "border-indigo-200 group-hover:border-indigo-400"
    },
    { 
      id: 6, 
      title: "همایش و گردهمایی", 
      subtitle: "دیدار با هم‌فکران",
      icon: <Users className="w-6 h-6 text-cyan-600" />, 
      href: "/conferences",
      gradient: "from-cyan-500 to-teal-400",
      iconBg: "bg-cyan-100 group-hover:bg-cyan-200",
      borderColor: "border-cyan-200 group-hover:border-cyan-400"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
      <Container>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/10 rounded-full blur-3xl animate-pulse delay-500" />
          
          {/* Floating Orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className={`absolute w-2 h-2 rounded-full ${
                i % 2 === 0 ? 'bg-blue-400/30' : 'bg-emerald-400/30'
              }`}
              style={{
                top: `${10 + i * 12}%`,
                left: `${5 + i * 12}%`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10"
        >
          {/* Pins Line - Top, Right to Left Direction */}
          <div className="flex justify-end gap-1 mb-6 pl-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + (4 - i) * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${
                  i === 4 ? 'bg-blue-400' : 
                  i === 3 ? 'bg-emerald-400' : 
                  i === 2 ? 'bg-cyan-400' :
                  i === 1 ? 'bg-teal-400' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            قطب‌نمای علم
          </h2>
          
          {/* Pins Line - Bottom, Left to Right Direction */}
          <div className="flex justify-start gap-1 mt-6 pr-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 8 + i * 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-1 rounded-full ${
                  i === 0 ? 'bg-blue-400' : 
                  i === 1 ? 'bg-emerald-400' : 
                  i === 2 ? 'bg-cyan-400' :
                  i === 3 ? 'bg-teal-400' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          {hubItems.map((item, index) => (
            <ScienceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ScienceCard({ item, index }: { item: HubItem; index: number }) {
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
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Link 
        href={item.href} 
        className="block h-full"
        onClick={() => setIsClicked(true)}
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
          className={`group relative flex flex-col items-center justify-start p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-2 ${item.borderColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center overflow-hidden h-full`}
        >
          {/* 3D Card Glow Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isHovered 
                ? `radial-gradient(circle at ${mouseX.get() + 50}% ${mouseY.get() + 50}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
                : "transparent",
            }}
          />

          {/* Gradient Orb Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isHovered ? 0.15 : 0,
              scale: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-2xl`}
          />

          {/* Shine Effect */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={isHovered ? { x: "200%", opacity: [0, 0.2, 0] } : { x: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Icon Container with 3D effect and Spin on Click */}
          <motion.div
            style={{
              transform: isHovered ? "translateZ(40px)" : "translateZ(0px)",
            }}
            animate={isClicked ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onAnimationComplete={() => setIsClicked(false)}
            className={`relative z-10 mb-4 p-4 ${item.iconBg} rounded-2xl border-2 ${item.borderColor} transition-all duration-300 flex items-center justify-center`}
          >
            {item.icon}
          </motion.div>

          {/* Content */}
          <motion.div
            style={{
              transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
            }}
            className="relative z-10"
          >
            <h3 className="text-sm sm:text-base font-[iranBold] text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-text-secondary/70 mb-3">
              {item.subtitle}
            </p>
            
            {/* Animated Arrow */}
            <motion.div
              initial={{ x: 0, opacity: 0.5 }}
              animate={isHovered ? { x: 5, opacity: 1 } : { x: 0, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1 text-xs font-medium"
            >
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`}>
                بزن بریم
              </span>
              <ArrowUpRight className={`w-3 h-3 text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`} />
            </motion.div>
          </motion.div>

          {/* Bottom Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.4 }}
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}