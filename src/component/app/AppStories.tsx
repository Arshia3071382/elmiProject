'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Sparkles } from 'lucide-react';

interface Story {
  _id?: string;
  id?: string;
  title?: string;
  image?: string;       
  image_url?: string;   
  link?: string;
  target_url?: string;
}

export default function AppStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        const items = data.stories || data || [];
        if (Array.isArray(items)) {
          setStories(items);
        }
      })
      .catch((err) => console.error('Error loading stories from Supabase:', err));
  }, []);

  // ارسال وضعیت باز یا بسته بودن استوری به لایوت برای مخفی‌سازی نوبار پایین
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('pwaStoryToggle', { detail: { isOpen: activeStoryIndex !== null } });
      window.dispatchEvent(event);
    }
  }, [activeStoryIndex]);

  useEffect(() => {
    if (activeStoryIndex === null || stories.length === 0) return;

    setProgress(0);
    const intervalTime = 50; 
    const totalDuration = 5000; 
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIndex, stories.length]);

  if (stories.length === 0) return null;

  return (
    <div className="w-full my-4 px-3">
      {/* عنوان بخش استوری‌ها همراه با آیکون‌های مینیمال و تراز سمت راست */}
      <div className="flex justify-between items-center mb-2 -mr-2.5">
        <div className="flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
          <h3 className="text-xs font-bold text-gray-700">استوری‌های علمی</h3>
        </div>
      </div>

      {/* دایره‌های استوری افقی */}
      <div className="flex gap-3 overflow-x-auto py-1 px-1 scrollbar-none dir-rtl">
        {stories.map((story, index) => {
          const imageUrl = story.image || story.image_url || '';
          const storyId = story._id || story.id || index;

          return (
            <div
              key={storyId}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center cursor-pointer shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition shadow-sm">
                <div className="w-full h-full rounded-full border-2 border-white relative overflow-hidden bg-gray-100">
                  {imageUrl && (
                    <Image 
                      src={imageUrl} 
                      alt={story.title || 'Story'} 
                      fill 
                      sizes="64px"
                      className="object-cover" 
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <span className="text-[11px] font-medium text-gray-600 mt-1 max-w-[64px] truncate text-center">
                {story.title || 'استوری'}
              </span>
            </div>
          );
        })}
      </div>

      {/* مودال نمایش استوری تمام‌صفحه با بالاترین لایه (z-index) */}
      {activeStoryIndex !== null && (() => {
        const currentStory = stories[activeStoryIndex];
        const currentImage = currentStory?.image || currentStory?.image_url || '';
        const targetLink = currentStory?.link || currentStory?.target_url;

        return (
          <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center dir-rtl">
            <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-2xl overflow-hidden bg-black flex flex-col justify-between">
              
              {/* نوار پیشرفت بالا */}
              <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                {stories.map((_, idx) => (
                  <div key={idx} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx < activeStoryIndex
                            ? '100%'
                            : idx === activeStoryIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* هدر استوری */}
              <div className="absolute top-7 left-4 right-4 z-20 flex justify-between items-center text-white">
                <span className="text-xs font-bold drop-shadow">
                  {currentStory?.title || ''}
                </span>
                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-base font-bold hover:bg-black/70"
                >
                  ✕
                </button>
              </div>

              {/* عکس اصلی استوری */}
              <div className="relative w-full h-full flex items-center justify-center">
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt="Story Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                    unoptimized
                  />
                )}
              </div>

              {/* دکمه لینک در صورت وجود */}
              {targetLink && (
                <div className="absolute bottom-6 left-4 right-4 z-20 text-center">
                  <a
                    href={targetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-black font-bold py-2.5 px-6 rounded-full shadow-lg hover:bg-gray-100 transition text-xs"
                  >
                    مشاهده جزئیات / لینک مرتبط
                  </a>
                </div>
              )}

              {/* نواحی لمسی برای جابجایی */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
                onClick={() => {
                  if (activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1);
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
                onClick={() => {
                  if (activeStoryIndex < stories.length - 1) {
                    setActiveStoryIndex(activeStoryIndex + 1);
                  } else {
                    setActiveStoryIndex(null);
                  }
                }}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}