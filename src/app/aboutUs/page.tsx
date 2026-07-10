"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Compass, BookOpen, Users, Award, TrendingUp, Sparkles } from 'lucide-react';
import TimelineHeader from './TimelineHeader';
import DesktopTimeline from './DesktopTimeline';
import MobileTimeline from './MobileTimeline';

// Database array
const timelineData = [
  { year: "1398", title: "نقطه آغاز؛ خشت اول", description: "شروع مسیر با انگیزه و پر از چالش. تشکیل هسته اولیه تیم و تدوین اهداف بلندمدت برای ایجاد تحول آموزشی در کشور.", icon: Compass, images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop"] },
  { year: "1399", title: "توسعه زیرساخت و بسترها", description: "راه‌اندازی اولین نسخه‌های پلتفرم علمی و جذب اولین مخاطبان تخصصی در سراسر کشور جهت ارتقای بستر یادگیری هوشمند.", icon: BookOpen, images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop"] },
  { year: "1400", title: "شکوفایی و افزایش مخاطب", description: "برگزاری دوره‌های تخصصی مشترک با مراکز علمی معتبر و عبور از مرز هزار دانش‌پژوه فعال و همراه در عرصه مهارت‌افزایی.", icon: Users, images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop"] },
  { year: "1401", title: "کسب عناوین و افتخارات", description: "انتخاب به عنوان پلتفرم برتر آموزشی در رویدادهای ملی و تقدیر از رویکرد نوین مجموعه در همایش نوآوری‌های کشور.", icon: Award, images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&auto=format&fit=crop"] },
  { year: "1402", title: "توسعه سراسری و هوشمندسازی", description: "ورود فناوری هوش مصنوعی به سیستم آموزشی مجموعه و شخصی‌سازی پیشرفته مسیر یادگیری کاربران به صورت پویا.", icon: TrendingUp, images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop"] },
  { year: "1403", title: "بین‌المللی شدن فعالیت‌ها", description: "تولید و عرضه محتوای علمی تراز اول به زبان‌های بین‌المللی و جذب دانش‌پژوهان فعال از کشورهای همسایه منطقه.", icon: Sparkles, images: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop"] },
  { year: "1404", title: "تحول بزرگ آموزشی", description: "راه‌اندازی بزرگ‌ترین شبکه تعاملی اساتید و دانش‌پژوهان با رویکرد نوین حل مسئله و ایجاد اشتغال پایدار تخصصی.", icon: BookOpen, images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop"] },
  { year: "1405", title: "قله هدف； چشم‌انداز نهایی", description: "تحقق کامل اهداف استراتژیک مجموعه و تبدیل شدن به مرجع علمی، نوآوری و قطب فناوری آموزشی در تراز منطقه.", icon: Award, images: ["https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop"] }
];

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  return (
    <div dir="rtl" ref={containerRef} className="min-h-screen bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden font-sans">
      <TimelineHeader />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative pb-32">
        {/* Timeline line vectors */}
        <div className="absolute right-6 md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-[3px] bg-[#E5E7EB] border-dashed border-r pointer-events-none" />
        <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute right-6 md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#2563EB] via-[#38BDF8] to-[#22C55E] pointer-events-none rounded-full z-10" />

        {/* Render list rows */}
        <div className="space-y-24 md:space-y-36 relative">
          {timelineData.map((item) => (
            <div key={item.year} className="relative">
              <DesktopTimeline item={item} />
              <MobileTimeline item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}