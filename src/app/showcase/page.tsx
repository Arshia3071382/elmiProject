import Link from "next/link";
import Image from "next/image";
import connectDB from "./../../../lib/dbConnect";
import Showcase from "./../../../models/Showcase";
import Container from "@/component/Container";

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
  const albums = await Showcase.find({ published: true })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <Container>
      <main className="min-h-screen mt-10 sm:mt-30 bg-slate-50 py-10 px-4 font-[iranSans-r]">
        <div className="max-w-6xl mx-auto">
          {/* عنوان با هر حرف یک رنگ از پالت آبی و سبز */}
          <div className="text-center mb-12">
            <h1
              dir="rtl"
              className="
                text-5xl
                md:text-7xl
                font-[iranBold]
                tracking-tight
                inline-flex
                items-center
                justify-center
                gap-1
              "
            >
              {/* و - آبی تیره */}
              <span className="text-[#1a56db] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300">
                و
              </span>
              
              {/* ی - آبی متوسط */}
              <span className="text-[#2563eb] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-75">
                ی
              </span>
              
              {/* ت - آبی روشن */}
              <span className="text-[#3b82f6] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-150">
                ت
              </span>
              
              {/* ر - آبی-سبز */}
              <span className="text-[#0891b2] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-200">
                ر
              </span>
              
              {/* ی - سبز روشن */}
              <span className="text-[#10b981] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-250">
                ی
              </span>
              
              {/* ن - سبز تیره */}
              <span className="text-[#059669] inline-block hover:scale-110 hover:rotate-[-5deg] transition-all duration-300 delay-300">
                ن
              </span>
            </h1>
            
          </div>

          {/* لیست کارت‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {albums.map((album: any) => {
              const imageUrl = getCloudinaryUrl(album.coverImage);

              return (
                <Link
                  key={album._id.toString()}
                  href={`/showcase/${album.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                    
                    {/* گرادیانت روی تصویر */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="p-4 text-right">
                    <h2 className="font-[iranBold] text-slate-800 group-hover:text-teal-600 transition">
                      {album.title}
                    </h2>
                    {album.date && (
                      <p className="text-xs text-slate-400 mt-2">
                        {album.date}
                      </p>
                    )}
                  </div>
                  
                  {/* خط پایین با گرادیانت */}
                  <div className="h-1 w-full bg-gradient-to-l from-[#1a56db] via-[#3b82f6] via-[#0891b2] to-[#059669]"></div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </Container>
  );
}