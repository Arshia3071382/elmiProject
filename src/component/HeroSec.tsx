'use client'

import React, { useState, useEffect, useRef, TouchEvent } from 'react'
import Container from './Container'
import Image from 'next/image'

const images: string[] = [
  "/image/heroSection/hero17.png",
  "/image/heroSection/hero13.jpg",
  "/image/heroSection/hero20.png",
  "/image/heroSection/hero22.png",
  "/image/heroSection/hero16.png",
  "/image/heroSection/hero15.png",
  "/image/heroSection/hero21.png",
  "/image/heroSection/hero11.png",
  "/image/heroSection/hero12.png",
  "/image/heroSection/hero18.png",
  "/image/heroSection/hero23.png"
]

interface HeroSecProps {
  isLoaded?: boolean; // اضافه کردن این پروپ برای کنترل شروع تایمر
}

function HeroSec({ isLoaded = true }: HeroSecProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  useEffect(() => {
    // تا زمانی که پریلودر تمام نشده یا موس روی آن است، تایمر روشن نمی‌شود
    if (!isLoaded || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000) 

    return () => clearInterval(timer)
  }, [isPaused, isLoaded])

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    } else if (isRightSwipe) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  return (
    <Container>
      <div 
        className='w-full max-w-5xl mx-auto mt-10 sm:mt-10 lg:mt-30 h-[230px] sm:h-[400px] lg:h-[500px] relative overflow-hidden rounded-2xl group shadow-2xl touch-pan-y'
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((imgSrc, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                isActive 
                  ? 'opacity-100 z-10' 
                  : 'opacity-0 z-0'
              }`}
            >
              <Image 
                src={imgSrc} 
                alt={`herosection-slide-${index + 1}`} 
                fill
                priority={index === 0}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 900px"
                className="object-cover rounded-2xl select-none"
              />
            </div>
          )
        })}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 pointer-events-none" />

        {/* Pagination dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-5 sm:w-7 bg-white' 
                  : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}

export default HeroSec