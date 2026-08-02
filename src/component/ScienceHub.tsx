"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Container from "./Container";
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
      subtitle: "جواب چالش های ذهنی شما",
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
      title: "ویترین علمی", 
      subtitle: "فریم به فریم با علمی",
      icon: <Film className="w-6 h-6 text-sky-600" />, 
      href: "/showcase", // مسیر اصلاح شد به /showcase
      gradient: "from-sky-500 to-blue-400",
      iconBg: "bg-sky-100 group-hover:bg-sky-200",
      borderColor: "border-sky-200 group-hover:border-sky-400"
    },
    { 
      id: 4, 
      title: "تقویم علمی", 
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
    <Container>
      <section className="py-20 Mt-10 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
        {/* المان‌های پس‌زمینه متحرک */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/10 rounded-full blur-3xl animate-pulse delay-500" />
          
          {/* ذرات معلق */}
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

        {/* هدر بخش */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10"
        >
          {/* خط‌چین بالا */}
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
          
          {/* خط‌چین پایین */}
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

        {/* گرید ریسپانسیو */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 relative z-10">
          {hubItems.map((item, index) => (
            <ScienceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>
    </Container>
  );
}

function ScienceCard({ item, index }: { item: HubItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [8, -8]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-8, 8]), { damping: 20, stiffness: 200 });

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
      className="h-full"
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
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`group relative flex flex-col items-center justify-between p-4 sm:p-8 bg-white border-2 ${item.borderColor} rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center overflow-hidden h-full`}
        >
          {/* هاله رنگی پس‌زمینه */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isHovered ? 0.05 : 0,
              scale: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-xl pointer-events-none -z-10`}
          />

          {/* محتوای اصلی کارت */}
          <div className="w-full flex flex-col items-center relative z-10">
            {/* آیکون */}
            <motion.div
              animate={isClicked ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onAnimationComplete={() => setIsClicked(false)}
              className={`mb-3 sm:mb-4 p-3 sm:p-4 ${item.iconBg} rounded-2xl border-2 ${item.borderColor} transition-all duration-300 flex items-center justify-center`}
            >
              {item.icon}
            </motion.div>

            {/* بخش متن‌ها */}
            <div className="w-full">
              <h3 className="text-xs sm:text-base font-[iranBold] text-primary mb-1 opacity-100 antialiased">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-text-secondary mb-3 sm:mb-4 opacity-100 antialiased">
                {item.subtitle}
              </p>
            </div>
          </div>

          {/* دکمه و فلش */}
          <div className="w-full mt-auto relative z-10">
            <motion.div
              initial={{ x: 0 }}
              animate={isHovered ? { x: 4 } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium"
            >
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${item.gradient} font-[iranBold] antialiased`}>
                بزن بریم
              </span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
            </motion.div>
          </div>

          {/* خط تزئینی پایین کارت */}
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