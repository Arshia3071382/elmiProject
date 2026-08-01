import { notFound } from "next/navigation";
import connectDB from "./../../../../lib/dbConnect";
import Showcase from "./../../../../models/Showcase";
import ShowcaseGallery from "@/component/ShowcaseGallery";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  await connectDB();

  const album = await Showcase.findOne({ slug }).lean();

  if (!album) {
    return notFound();
  }

  return (
    <main className="min-h-screen mt-10 sm:mt-30 bg-slate-50 py-12 px-4 dir-rtl font-[iranSans-r]">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        {/* اطلاعات آلبوم */}
        <h1 className="text-2xl md:text-3xl font-[iranBold] text-slate-900 mb-3">
          {album.title}
        </h1>

        {album.date && (
          <span className="inline-block bg-teal-50 text-teal-700 text-xs font-[iranBold] px-3 py-1 rounded-full mb-4">
            {album.date}
          </span>
        )}

        {album.description && (
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-2 border-b border-slate-100 pb-6">
            {album.description}
          </p>
        )}

        {/* 🔹 گالری تصاویر کامل پوشه همراه با مودال تیره */}
        <ShowcaseGallery
          folder={album.folder}
          initialCover={album.coverImage}
        />
      </div>
    </main>
  );
}