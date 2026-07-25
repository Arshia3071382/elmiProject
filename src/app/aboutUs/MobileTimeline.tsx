"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { TimelineItem } from "./page";

interface TimelineItemProps {
  item: TimelineItem;
}

export default function MobileTimeline({ item }: TimelineItemProps) {
  const IconComponent = item.icon;

  return (
    <div className="flex md:hidden items-start w-full relative">
      {/* Line pinpoint */}
      <div className="absolute right-0 top-2 z-20 flex items-center justify-center w-12">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative w-10 h-10 flex items-center justify-center"
        >
          <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-30" />
          <div className="bg-gradient-to-br from-blue-600 to-slate-800 p-2 rounded-xl text-white shadow-md border border-sky-400/40 flex flex-col items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black">{item.year}</span>
          </div>
        </motion.div>
      </div>

      {/* Content card */}
      <div className="w-full mr-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="h-44 w-full relative overflow-hidden">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-600">
              <IconComponent className="w-4.5 h-4.5 flex-shrink-0" />
              <h3 className="text-base font-black text-slate-800">
                {item.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}