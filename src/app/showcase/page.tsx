import Link from "next/link";
import Image from "next/image";
import connectDB from "./../../../lib/dbConnect";
import Showcase from "./../../../models/Showcase";

export const dynamic = "force-dynamic";

function getCloudinaryUrl(publicId: string | undefined | null) {
  if (!publicId) return "/placeholder.jpg";
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }
  const cleanId = publicId.replace(/^\//, "");
  return `https://res.cloudinary.com/s0zu8byn/image/upload/q_auto,f_auto/${cleanId}`;
}

export default async function ShowcaseListPage() {
  await connectDB();
  const albums = await Showcase.find({ published: true }).sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen mt-10 sm:mt-30 bg-slate-50 py-10 px-4 dir-rtl font-[iranSans-r]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-[iranBold] text-slate-900 mb-8 text-center">
          ویترین علمی
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album: any) => {
            const imageUrl = getCloudinaryUrl(album.coverImage);

            return (
              <Link
                key={album._id.toString()}
                href={`/showcase/${album.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-[iranBold] text-slate-800 group-hover:text-teal-600 transition">
                    {album.title}
                  </h2>
                  {album.date && (
                    <p className="text-xs text-slate-400 mt-2">{album.date}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}