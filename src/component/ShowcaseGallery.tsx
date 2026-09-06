"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";

interface Props {
  images: string[];
  date?: string;
  description?: string;
}

function getImageUrl(url: string) {
  if (!url) {
    return "/placeholder.jpg";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return url;
}

export default function ShowcaseGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const validImages = Array.from(
    new Set(
      images.filter(
        (img) =>
          typeof img === "string" &&
          img.trim() !== ""
      )
    )
  );

  const handleNext = () => {
    if (selectedIndex === null || validImages.length <= 1) return;

    setSelectedIndex(
      (prev) => (prev! + 1) % validImages.length
    );
  };

  const handlePrev = () => {
    if (selectedIndex === null || validImages.length <= 1) return;

    setSelectedIndex(
      (prev) =>
        (prev! - 1 + validImages.length) %
        validImages.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "Escape") {
        setSelectedIndex(null);
      }

      if (e.key === "ArrowLeft") {
        handleNext();
      }

      if (e.key === "ArrowRight") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, validImages.length]);

  return (
    <div className="mt-8 space-y-6" dir="rtl">
      {/* Gallery Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 font-[iranBold] text-slate-800 text-lg">
          <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
            <Images className="w-5 h-5" />
          </div>
          <span>تصاویر آلبوم</span>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
          {validImages.length} تصویر
        </span>
      </div>

      {/* Empty */}
      {validImages.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-400 text-sm">
          تصویری برای این آلبوم ثبت نشده است.
        </div>
      ) : (
        /* Gallery Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {validImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className="
                relative
                w-full
                h-36
                md:h-44
                rounded-2xl
                overflow-hidden
                cursor-pointer
                group
                bg-slate-100
                border
                border-slate-200/80
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
                text-right
              "
            >
              <Image
                src={getImageUrl(img)}
                alt={`تصویر ${idx + 1}`}
                fill
                sizes="
                  (max-width: 640px) 50vw,
                  (max-width: 768px) 33vw,
                  25vw
                "
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 text-white text-xs font-[iranBold]">
                <span>مشاهده تصویر</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedIndex !== null &&
        validImages.length > 0 && (
          <div
            className="
              fixed
              inset-0
              z-50
              bg-black/90
              backdrop-blur-md
              flex
              items-center
              justify-center
              p-4
            "
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="
                absolute
                top-5
                right-5
                p-2.5
                bg-white/10
                hover:bg-white/20
                text-white
                rounded-full
                transition
                z-50
              "
              aria-label="بستن"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/80 text-sm font-mono dir-ltr bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {validImages.length}
            </div>

            {/* Previous */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="
                  absolute
                  right-4
                  md:right-8
                  top-1/2
                  -translate-y-1/2
                  p-3
                  bg-white/10
                  hover:bg-white/20
                  text-white
                  rounded-full
                  transition
                  z-50
                "
                aria-label="تصویر قبلی"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Main Image */}
            <div
              className="
                relative
                w-full
                max-w-5xl
                h-[75vh]
                flex
                items-center
                justify-center
              "
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImageUrl(
                  validImages[selectedIndex]
                )}
                alt="بزرگ‌نمایی تصویر"
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Next */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="
                  absolute
                  left-4
                  md:left-8
                  top-1/2
                  -translate-y-1/2
                  p-3
                  bg-white/10
                  hover:bg-white/20
                  text-white
                  rounded-full
                  transition
                  z-50
                "
                aria-label="تصویر بعدی"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
          </div>
        )}
    </div>
  );
}