import { notFound } from "next/navigation";
import connectDB from "../../../../lib/dbConnect";
import Showcase from "../../../../models/Showcase";
import ShowcaseGallery from "@/component/ShowcaseGallery";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AlbumDetailPage({
  params,
}: PageProps) {
  const resolvedParams = await params;
  const paramVal = decodeURIComponent(resolvedParams.slug).trim();

  await connectDB();

  let query: any = {
    slug: { $regex: new RegExp(`^${paramVal}$`, "i") },
  };

  if (mongoose.Types.ObjectId.isValid(paramVal)) {
    query = {
      $or: [
        { _id: paramVal },
        { slug: { $regex: new RegExp(`^${paramVal}$`, "i") } }
      ]
    };
  }

  const album = await Showcase.findOne(query).lean();

  if (!album) {
    return notFound();
  }

  const typedAlbum = album as any;

  const images = Array.isArray(typedAlbum.images)
    ? typedAlbum.images.filter(
        (img: string) =>
          typeof img === "string" &&
          img.trim() !== ""
      )
    : [];

  const cover =
    typeof typedAlbum.coverImage === "string" &&
    typedAlbum.coverImage.trim() !== ""
      ? typedAlbum.coverImage
      : "";

  const finalImages = Array.from(
    new Set([cover, ...images].filter(Boolean))
  );

  // دقیقاً مقدار ثبت شده در پنل ادمین را می‌خواند (بدون تبدیل تاریخ به امروز)
  const albumDate = typedAlbum.date && typedAlbum.date.trim() !== "" 
    ? typedAlbum.date 
    : "تاریخ ثبت نشده";

  const albumDescription = typedAlbum.description && typedAlbum.description.trim() !== ""
    ? typedAlbum.description
    : "توضیحات تکمیلی برای این آلبوم تصویری ثبت نشده است.";

  return (
    <main
      className="min-h-screen mt-10 sm:mt-30 bg-slate-50 py-12 px-4 dir-rtl font-[iranSans-r]"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-[iranBold] text-slate-900 mb-3">
            {typedAlbum.title}
          </h1>

          <span className="inline-block bg-teal-50 text-teal-700 text-xs font-[iranBold] px-3 py-1 rounded-full mb-4">
            {albumDate}
          </span>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-2 border-b border-slate-100 pb-6">
            {albumDescription}
          </p>
        </div>

        {/* Gallery */}
        <div className="mt-6">
          <ShowcaseGallery 
            images={finalImages} 
            date={albumDate} 
            description={albumDescription} 
          />
        </div>
      </div>
    </main>
  );
}