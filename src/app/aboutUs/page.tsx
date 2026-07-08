"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MapPin, Sparkles, Calendar, BookOpen, Award, Users, TrendingUp, Compass } from 'lucide-react';

const timelineData = [
  {
    year: "1398",
    title: "نقطه آغاز؛ خشت اول",
    description: "شروع مسیر با انگیزه و پر از چالش. تشکیل هسته اولیه تیم و تدوین اهداف بلندمدت برای ایجاد تحول آموزشی در کشور.",
    icon: Compass,
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1399",
    title: "توسعه زیرساخت و بسترها",
    description: "راه‌اندازی اولین نسخه‌های پلتفرم علمی و جذب اولین مخاطبان تخصصی در سراسر کشور جهت ارتقای بستر یادگیری هوشمند.",
    icon: BookOpen,
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1400",
    title: "شکوفایی و افزایش مخاطب",
    description: "برگزاری دوره‌های تخصصی مشترک با مراکز علمی معتبر و عبور از مرز هزار دانش‌پژوه فعال و همراه در عرصه مهارت‌افزایی.",
    icon: Users,
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1401",
    title: "کسب عناوین و افتخارات",
    description: "انتخاب به عنوان پلتفرم برتر آموزشی در رویدادهای ملی و تقدیر از رویکرد نوین مجموعه در همایش نوآوری‌های کشور.",
    icon: Award,
    images: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1402",
    title: "توسعه سراسری و هوشمندسازی",
    description: "ورود فناوری هوش مصنوعی به سیستم آموزشی مجموعه و شخصی‌سازی پیشرفته مسیر یادگیری کاربران به صورت پویا.",
    icon: TrendingUp,
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1403",
    title: "بین‌المللی شدن فعالیت‌ها",
    description: "تولید و عرضه محتوای علمی تراز اول به زبان‌های بین‌المللی و جذب دانش‌پژوهان فعال از کشورهای همسایه منطقه.",
    icon: Sparkles,
    images: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1404",
    title: "تحول بزرگ آموزشی",
    description: "راه‌اندازی بزرگ‌ترین شبکه تعاملی اساتید و دانش‌پژوهان با رویکرد نوین حل مسئله و ایجاد اشتغال پایدار تخصصی.",
    icon: BookOpen,
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop"
    ]
  },
  {
    year: "1405",
    title: "قله هدف； چشم‌انداز نهایی",
    description: "تحقق کامل اهداف استراتژیک مجموعه و تبدیل شدن به مرجع علمی، نوآوری و قطب فناوری آموزشی در تراز منطقه.",
    icon: Award,
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=300&auto=format&fit=crop"
    ]
  }
];

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <div dir="rtl" ref={containerRef} className="min-h-screen bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden font-sans">
      
      {/* هدر آغازین نقشه گنج */}
      <div className="max-w-5xl mx-auto text-center pt-20 pb-16 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-[#1F3A5F]/5 border border-[#1F3A5F]/10 px-4 py-2 rounded-full text-[#1F3A5F] text-sm mb-6 font-bold"
        >
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span>هوالمحبوب</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl md:text-5xl font-black text-[#1F3A5F] mb-6 tracking-tight"
        >
          داستان یک نقشه گنج علمی
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base md:text-lg text-[#475569] leading-relaxed max-w-3xl mx-auto border-r-4 border-[#2563EB] pr-4 bg-white p-5 rounded-l-2xl shadow-sm border border-[#E5E7EB]"
        >
          «آغاز گام‌های ما در این مسیر پرپیچ‌وخم، با توسل و عهدی قلبی به پیشگاه <span className="text-[#2563EB] font-bold">حضرت ولی‌عصر (عج)</span> گره خورد؛ به این امید که هر قدممان، نوری در مسیر رشد و تعالی جوانان این مرز و بوم باشد.»
        </motion.p>
      </div>

      {/* بخش بدنه تایم‌لاین */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative pb-32">
        
        {/* ۱. خط راهنمای ثابت: در دسکتاپ دقیقاً وسط (right-1/2) و در موبایل سمت راست (right-6) */}
        <div className="absolute right-6 md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-[3px] bg-[#E5E7EB] border-dashed border-r pointer-events-none" />

        {/* ۲. خط راهنمای متحرک اسکرول: هماهنگ با موقعیت خط ثابت */}
        <motion.div 
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute right-6 md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#2563EB] via-[#38BDF8] to-[#22C55E] pointer-events-none rounded-full z-10"
        />

        <div className="space-y-24 md:space-y-36 relative">
          {timelineData.map((item) => {
            const IconComponent = item.icon;

            return (
              <div key={item.year} className="relative">
                
                {/* ================= نمای دسکتاپ ================= */}
                <div className="hidden md:flex items-center justify-between w-full relative">
                  
                  {/* سمت چپ: توضیحات سال و اهداف */}
                  <div className="w-[45%] pl-12">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#2563EB]/10 rounded-xl text-[#2563EB]">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1F3A5F]">{item.title}</h3>
                      </div>
                      <p className="text-base text-[#475569] leading-relaxed font-normal max-w-xl">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* مرکز صفحه: موقعیت‌نما و سال روی خط */}
                  <div className="absolute right-1/2 translate-x-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="relative w-12 h-12 flex items-center justify-center"
                    >
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#38BDF8] opacity-30" />
                      <div className="bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] p-2.5 rounded-xl text-white shadow-md border border-[#38BDF8]/40 flex flex-col items-center justify-center cursor-pointer">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[9px] font-black">{item.year}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* سمت راست: پازل سه عکسه */}
                  <div className="w-[45%] pr-12 flex items-center justify-start">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7 }}
                      className="grid grid-cols-2 gap-3 w-full max-w-[360px]"
                    >
                      <div className="col-span-2 h-40 rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                      <div className="h-28 rounded-xl overflow-hidden shadow-sm border border-[#E5E7EB]">
                        <img src={item.images[1]} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                      <div className="h-28 rounded-xl overflow-hidden shadow-sm border border-[#E5E7EB]">
                        <img src={item.images[2]} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* ================= نمای موبایل و تبلت ================= */}
                <div className="flex md:hidden items-start w-full relative">
                  
                  {/* نشانگر سال و لوکیشن متحرک روی خط (چسبیده به سمت راست مرورگر با فاصله ایمن) */}
                  <div className="absolute right-0 top-2 z-20 flex items-center justify-center w-12">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="relative w-10 h-10 flex items-center justify-center"
                    >
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#38BDF8] opacity-30" />
                      <div className="bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] p-2 rounded-xl text-white shadow-md border border-[#38BDF8]/40 flex flex-col items-center justify-center">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[8px] font-black">{item.year}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* کارت اصلی محتوا: چیده شده در سمت چپِ خط مسیر با فاصله اصولی */}
                  <div className="w-full mr-16">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
                    >
                      {/* تصویر شاخص عریض در بالای کارت */}
                      <div className="h-44 w-full overflow-hidden">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      </div>

                      {/* توضیحات و اهداف در زیر عکس */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-[#2563EB]">
                          <IconComponent className="w-4.5 h-4.5 flex-shrink-0" />
                          <h3 className="text-base font-black text-[#1F3A5F]">{item.title}</h3>
                        </div>
                        <p className="text-xs text-[#475569] leading-relaxed font-light">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}