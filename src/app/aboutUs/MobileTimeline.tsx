"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface TimelineItemProps {
  item: {
    year: string; title: string; description: string; images: string[]; icon: React.ComponentType<any>;
  };
}

export default function MobileTimeline({ item }: TimelineItemProps) {
  const IconComponent = item.icon;

  return (
    <div className="flex md:hidden items-start w-full relative">
      {/* Line pinpoint */}
      <div className="absolute right-0 top-2 z-20 flex items-center justify-center w-12">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="relative w-10 h-10 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#38BDF8] opacity-30" />
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] p-2 rounded-xl text-white shadow-md border border-[#38BDF8]/40 flex flex-col items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black">{item.year}</span>
          </div>
        </motion.div>
      </div>

      {/* Content card */}
      <div className="w-full mr-16">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="h-44 w-full overflow-hidden">
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <IconComponent className="w-4.5 h-4.5 flex-shrink-0" />
              <h3 className="text-base font-black text-[#1F3A5F]">{item.title}</h3>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed font-light">{item.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}