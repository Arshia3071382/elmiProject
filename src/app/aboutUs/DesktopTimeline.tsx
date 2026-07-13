"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface TimelineItemProps {
  item: {
    year: string; title: string; description: string; images: string[]; icon: React.ComponentType<any>;
  };
}

export default function DesktopTimeline({ item }: TimelineItemProps) {
  const IconComponent = item.icon;

  return (
    <div className="hidden md:flex items-center justify-between w-full relative">
      {/* Text contents */}
      <div className="w-[45%] pl-12">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563EB]/10 rounded-xl text-[#2563EB]"><IconComponent className="w-5 h-5" /></div>
            <h3 className="text-2xl font-black text-[#1F3A5F]">{item.title}</h3>
          </div>
          <p className="text-base text-[#717274] leading-relaxed font-normal max-w-xl">{item.description}</p>
        </motion.div>
      </div>

      {/* Center indicator */}
      <div className="absolute right-1/2 translate-x-1/2 z-20 flex items-center justify-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="relative w-12 h-12 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#38BDF8] opacity-30" />
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] p-2.5 rounded-xl text-white shadow-md border border-[#38BDF8]/40 flex flex-col items-center justify-center cursor-pointer">
            <MapPin className="w-4 h-4" />
            <span className="text-[9px] font-black">{item.year}</span>
          </div>
        </motion.div>
      </div>

      {/* Image showcase */}
      <div className="w-[45%] pr-12 flex items-center justify-start">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-3 w-full max-w-[360px]">
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
  );
}