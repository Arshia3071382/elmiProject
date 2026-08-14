'use client'

import React, { useState, useEffect, useRef, TouchEvent } from 'react'
import Container from './Container'
import Image from 'next/image'

const images: string[] = [
  "/image/hero17.png",
  "/image/hero13.jpg",
  "/image/hero16.png",
  "/image/hero15.png",
  "/image/hero11.png",
  "/image/hero12.png",
  "/image/hero14.png"
]

function HeroSec() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [isPaused])

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
      {/* اعمال عرض کمتر با max-w-4xl (می‌توانید به max-w-3xl یا max-w-5xl هم تغییر دهید) */}
      <div 
        className='w-full max-w-4xl mx-auto mt-10 sm:mt-10 lg:mt-30 h-[230px] sm:h-[320px] lg:h-[400px] relative overflow-hidden rounded-2xl group shadow-2xl touch-pan-y'
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