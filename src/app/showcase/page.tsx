"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "@/component/Container";
import { Calendar, ArrowLeft, Search, Eye } from "lucide-react";

// تابع ساده و ایمن برای بررسی لینک تصویر
const getValidCover = (album: any) => {
  if (typeof album.coverImage === "string" && album.coverImage.trim() !== "") {
    return album.coverImage;
  }
  if (typeof album.cover === "string" && album.cover.trim() !== "") {
    return album.cover;
  }

  const images = Array.isArray(album.images) 
    ? album.images 
    : (Array.isArray(album.imageUrls) ? album.imageUrls : []);

  if (images.length > 0 && typeof images[0] === "string" && images[0].trim() !== "") {
    return images[0];
  }

  if (typeof album.folder === "string" && album.folder.trim() !== "") {
    return album.folder;
  }

  return "/placeholder.jpg";
};

// تابع کمکی برای فرمت تاریخ
const formatAlbumDate = (album: any) => {
  if (album.date && String(album.date).trim() !== "") {
    return album.date;
  }
  if (album.createdAt) {
    try {
      return new Date(album.createdAt).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return "تاریخ ثبت نشده";
    }
  }
  return "تاریخ ثبت نشده";
};

// تابع کمکی برای استخراج و مدیریت توضیحات
const getAlbumDescription = (album: any) => {
  const desc = album.description || album.desc || album.body;
  if (desc && String(desc).trim() !== "") {
    return desc;
  }
  return "گزارش تصویری و لحظات ثبت شده از این مجموعه...";
};

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
        } else if (data && Array.isArray(data.data)) {
          setAlbums(data.data);
        } else if (data && Array.isArray(data.albums)) {
          setAlbums(data.albums);
        } else {
          setAlbums([]);
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
    String(album.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim())
  );

  return (
    <Container>
      <main
        className="min-h-screen mt-10 sm:mt-28 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 py-12 px-4 sm:px-6 font-[iranSans-r]"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 relative">
            <h1 className="text-5xl md:text-7xl font-[iranBold] tracking-tight inline-flex items-center justify-center gap-1 relative z-10">
              <span className="text-[#1a56db]">و</span>
              <span className="text-[#2563eb]">ی</span>
              <span className="text-[#3b82f6]">ت</span>
              <span className="text-[#0891b2]">ر</span>
              <span className="text-[#10b981]">ی</span>
              <span className="text-[#059669]">ن</span>
            </h1>

            <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-md mx-auto">
              مجموعه‌ای از تصاویر، گزارش‌های تصویری و لحظات ماندگار مجموعه‌ی منتظران
            </p>

            {/* Search */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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

          {/* Albums */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-16 text-slate-400">
                در حال بارگذاری...
              </div>
            ) : filteredAlbums.length > 0 ? (
              filteredAlbums.map((album: any) => {
                const albumImages = Array.isArray(album.images) ? album.images : [];
                const validCover = getValidCover(album);
                const imagesCount = albumImages.length > 0 ? albumImages.length : (validCover !== "/placeholder.jpg" ? 1 : 0);

                const albumKey = String(album._id || album.id || album.slug || Math.random());
                const albumLink = `/showcase/${album.slug || album._id || album.id}`;
                const formattedDate = formatAlbumDate(album);
                const albumDescription = getAlbumDescription(album);

                return (
                  <Link
                    key={albumKey}
                    href={albumLink}
                    className="group relative bg-white rounded-3xl border border-slate-100/80 p-4 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1.5 flex flex-row items-center gap-4 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                      <img
                        src={validCover}
                        alt={album.title || "ویترین"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                      />
                      <span className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10 z-10">
                        {imagesCount} 📷
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between h-full min-h-[110px] min-w-0 relative z-10">
                      <div>
                        <h2 className="font-[iranBold] text-slate-800 text-base sm:text-lg group-hover:text-emerald-600 transition-colors duration-300 truncate">
                          {album.title}
                        </h2>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {albumDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs mt-2">
                        <span className="text-slate-500 flex items-center gap-1 font-medium bg-slate-50 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {formattedDate}
                        </span>

                        <span className="inline-flex items-center gap-1.5 font-[iranBold] text-emerald-700 bg-emerald-50/80 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl transition-all duration-300 shadow-sm">
                          <Eye className="w-3.5 h-3.5" />
                          <span>مشاهده</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
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