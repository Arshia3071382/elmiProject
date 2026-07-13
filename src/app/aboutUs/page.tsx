"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Compass, BookOpen, Users, Award, TrendingUp, Sparkles } from 'lucide-react';
import TimelineHeader from './TimelineHeader';
import DesktopTimeline from './DesktopTimeline';
import MobileTimeline from './MobileTimeline';

// Database array
const timelineData = [
  { year: "1398", title: "نقطه آغاز؛ خشت اول", description:"مسیر رو با افتتاح یک کتابخونه جامع برای ترویج  فرهنگ کتابخوانی آغاز کردیم ، این کتابخونه بستری برای برگزاری کلاس های درسی و مطالعه بیشتر دانش آموزان شد" , icon: Compass, images: ["/image/k7.jpeg", "/image/k8.jpeg", "/image/k6.jpg"] },
  { year: "1399", title: "توسعه زیرساخت و بسترها", description: "با افزایش جمعیت کلاس ها  برای بهبود کیفیت و افزایش بازدهی ، واحد علمی مجموعه رو افتتاح کردیم، در این واحد انواع دوره های آموزشی ، کاربردی و درسی با هدف ارتقای سطح علمی دانش آموزان برگزار شد", icon: BookOpen, images: ["/image/v3.jpeg", "/image/v2.jpeg", "/image/v1 (1).jpeg"] },
  { year: "1400", title: "شکوفایی و افزایش مخاطب", description: "اهداف ما خیلی بزرگ تر از برگزار کردن کلاس های ساده تقویتی بود ، به همین دلیل برای گسترش فعالیت  ،کادر علمی رو به گروه های مختلف تقسیم کردیم و معاونت هر گروه دارای یک  معین علمی و یک معین ارشد علمی شد. این کادر علمی در برنامه ها و جلسات متنوع علمی شرکت کردن تا برای اهداف بخش علمی مجموعه آماده بشن", icon: Users, images: ["/image/ordoQ.jpg", "/image/mah2.jpeg", "/image/mah1 (1).jpeg"] },
  { year: "1401", title: "تمرکز بر روی آینده شغلی و درسی", description: "از ابتدای شروع فعالیتمون همیشه دغدغه انتخاب رشته دانش آموزان مجموعه رو داشتیم، با شرکت در دوره های مختلف و با استفاده از مشاوران برتر انتخاب رشته پایه نهم و کنکور ، دانش آموزان رو با  رشته های مختلف و اشتباهات رایج اکثر هم سن و سالاشون آشنا کردیم", icon: Award, images: ["/image/m1.jpg" , "/image/m2.jpg" , "/image/1.jpg"]  },
  { year: "1401", title: "آشنایی دانش آموزان برتر با دستاوردهای علمی کشور", description: "یه اردوی جذاب  برای دانش آموزان ممتاز سال تحصیلی ، تو این اردو با دستاوردهای صنعت نظامی کشور آشنا شدیم و روحیه خودباوری  و خودکفایی در بچه ها بیشتر شد", icon: Award, images: ["/image/ordoP.jpg" , "/image/ordoP2.jpg" , "/image/ordoP3.jpg"]  },
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