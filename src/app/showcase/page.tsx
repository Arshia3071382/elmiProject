"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/component/Container";
import { Sparkles, Calendar, ArrowLeft, Search, Eye } from "lucide-react";

function getCloudinaryUrl(publicId: string | undefined | null) {
  if (!publicId) return "/placeholder.jpg";
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }
  const cleanId = publicId.replace(/^\//, "");
  return `https://res.cloudinary.com/s0zu8byn/image/upload/q_auto,f_auto/${cleanId}`;
}

export default function ShowcaseListPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch("/api/showcase");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAlbums(data);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <Container>
      <main className="min-h-screen mt-10 sm:mt-28 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 py-12 px-4 sm:px-6 font-[iranSans-r]" dir="rtl">
        <div className="max-w-7xl mx-auto">
          
          {/* هدر و کلمه ویترین دست‌نخورده */}
          <div className="text-center mb-14 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>
            </div>

           
            <h1
              className="
                text-5xl
                md:text-7xl
                font-[iranBold]
                tracking-tight
                inline-flex
                items-center
                justify-center
                gap-1
                relative
                z-10
              "
            >
              <span className="text-[#1a56db] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300">و</span>
              <span className="text-[#2563eb] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-75">ی</span>
              <span className="text-[#3b82f6] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-150">ت</span>
              <span className="text-[#0891b2] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-200">ر</span>
              <span className="text-[#10b981] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-250">ی</span>
              <span className="text-[#059669] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-300">ن</span>
            </h1>
            
            <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-md mx-auto font-[iranSans-r]">
              مجموعه‌ای از تصاویر، گزارش‌های تصویری و لحظات ماندگار مجموعه‌ی منتظران
            </p>

            {/* بخش جستجوی جذاب */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-emerald-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عنوان ویترین‌ها..."
                className="w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* لیست کارت‌ها */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-16 text-slate-400">
                در حال بارگذاری...
              </div>
            ) : filteredAlbums.length > 0 ? (
              filteredAlbums.map((album: any) => {
                const imageUrl = getCloudinaryUrl(album.coverImage);
                const imagesCount = album.images?.length || 0;

                return (
                  <Link
                    key={album._id.toString()}
                    href={`/showcase/${album.slug}`}
                    className="group relative bg-white rounded-3xl border border-slate-100/80 p-4 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1.5 flex flex-row items-center gap-4 overflow-hidden"
                  >
                    {/* افکت گرادیانت ملایم در پس‌زمینه کارت هنگام هاور */}
                    <div className="absolute inset-0 bg-gradient-to-l from-emerald-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* عکس کوچک مربعی rounded */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                      <Image
                        src={imageUrl}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                      />
                      
                      {/* گرادیانت روی تصویر */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

                      {imagesCount > 0 && (
                        <span className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10 z-10">
                          {imagesCount} 📷
                        </span>
                      )}
                    </div>
                    
                    {/* متن‌ها و دکمه */}
                    <div className="flex-1 flex flex-col justify-center gap-2.5 min-w-0 relative z-10">
                      <div>
                        <h2 className="font-[iranBold] text-slate-800 text-base sm:text-lg group-hover:text-emerald-600 transition-colors duration-300 truncate">
                          {album.title}
                        </h2>
                        {album.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed whitespace-normal break-words">
                            {album.description}
                          </p>
                        )}
                      </div>

                      {/* بخش تاریخ و دکمه مشاهده جذاب و سرسبز */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        {album.date ? (
                          <span className="text-slate-400 flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            {album.date}
                          </span>
                        ) : (
                          <span></span>
                        )}

                        {/* دکمه مشاهده اکشن‌دار و سبز */}
                        <span className="inline-flex items-center gap-2 font-[iranBold] text-emerald-700 bg-emerald-50/80 hover:bg-emerald-600 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-emerald-500/25 active:scale-95">
                          <Eye className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                          <span>مشاهده</span>
                          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                موردی با این عنوان یافت نشد.
              </div>
            )}
          </div>
        </div>
      </main>
    </Container>
  );
}