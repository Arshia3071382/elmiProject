"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

function getCloudinaryUrl(publicId: string) {
  if (!publicId) return "/placeholder.jpg";
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }
  const cleanId = publicId.replace(/^\//, "");
  return `https://res.cloudinary.com/s0zu8byn/image/upload/q_auto,f_auto/${cleanId}`;
}

interface Props {
  folder: string;
  initialCover: string;
}

export default function ShowcaseGallery({ folder, initialCover }: Props) {
  const [images, setImages] = useState<string[]>([initialCover]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`/api/showcase/images?folder=${encodeURIComponent(folder)}`);
        const data = await res.json();
        if (data.success && data.images.length > 0) {
          setImages(data.images);
        }
      } catch (err) {
        console.error("Failed to load album images:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [folder]);

  // کنترل با کلیدهای کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-end items-center gap-2 mb-4 font-[iranBold] text-slate-800">
        <Images className="w-5 h-5 text-teal-600" />
        <span>تصاویر آلبوم ({images.length} تصویر)</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-full h-40 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="relative w-full h-36 md:h-44 rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200 shadow-sm"
            >
              <Image
                src={getCloudinaryUrl(img)}
                alt={`تصویر ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-[iranBold]">
                مشاهده
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 مودال بزرگ‌نمایی با بک‌گراند تیره */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* دکمه بستن */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* شماره عکس */}
          <div className="absolute top-6 left-6 text-white/80 text-sm font-mono dir-ltr">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* دکمه بعدی */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* تصویر بزرگ */}
          <div className="relative w-full max-w-5xl h-[75vh] flex items-center justify-center">
            <Image
              src={getCloudinaryUrl(images[selectedIndex])}
              alt="بزرگ‌نمایی تصویر"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* دکمه قبلی */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}