// مسیر فایل: src/app/articles/[slug]/page.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, Heart, ExternalLink } from "lucide-react";
import dbConnect from "./../../../../lib/dbConnect";
import Article, { IArticle, IBlock } from "./../../../../models/Article";
import Container from "@/component/Container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    await dbConnect();
    const decodedSlug = decodeURIComponent(slug);
    const article = await Article.findOne({
      $or: [{ slug: slug }, { slug: decodedSlug }],
    }).lean<IArticle>();

    if (!article) return null;

    return {
      ...article,
      _id: String(article._id),
      createdAt: article.createdAt
        ? new Date(article.createdAt).toISOString()
        : null,
    };
  } catch (error) {
    console.error("خطا در دریافت مقاله:", error);
    return null;
  }
}

function truncateUrl(url: string, maxLength: number = 40): string {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  return `${url.substring(0, 20)}...${url.substring(url.length - 15)}`;
}

export default async function ArticleDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main
      className="min-h-screen bg-bg py-12 font-[iranSans-r] text-text-primary overflow-x-hidden"
      dir="rtl"
    >
      <Container>
        <div className="max-w-3xl mx-auto w-full text-right">
          {/* دکمه بازگشت */}
          <div className="mb-8">
            <Link
              href="/curiosity"
              className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-secondary transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به ایستگاه کنجکاوی</span>
            </Link>
          </div>

          {/* هدر مقاله */}
          <header className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-sm mb-8 break-words overflow-hidden text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[iranBold] text-primary leading-tight mb-4 break-words text-right">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 border-r-4 border-accent pr-4 pl-2 bg-accent/10 py-2.5 rounded-l-lg break-words text-right">
                {article.summary}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-text-secondary font-medium">
              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>انتشار: {formattedDate}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1 rounded-full font-bold border border-rose-100">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>{article.likes} لایک</span>
              </div>
            </div>
          </header>

          {/* محتوای بلوکی ساده */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6 overflow-hidden w-full text-right">
            {article.blocks && article.blocks.length > 0 ? (
              article.blocks.map((block: IBlock, index: number) => {
                if (block.type === "text") {
                  const isLink =
                    block.content.startsWith("http://") ||
                    block.content.startsWith("https://");

                  if (isLink) {
                    return (
                      <div
                        key={index}
                        className="my-3 p-3 bg-bg rounded-xl border border-border text-right"
                      >
                        <a
                          href={block.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-secondary hover:underline font-bold text-sm break-all"
                          dir="ltr"
                        >
                          <ExternalLink className="w-4 h-4 shrink-0" />
                          <span>{truncateUrl(block.content)}</span>
                        </a>
                      </div>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className="text-text-primary text-base sm:text-lg leading-loose whitespace-pre-line break-words text-right w-full overflow-hidden"
                    >
                      {block.content}
                    </p>
                  );
                }

                if (block.type === "image") {
                  return (
                    <figure key={index} className="my-6 w-full overflow-hidden">
                      <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-border shadow-sm">
                        <img
                          src={block.content}
                          alt={block.caption || article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-center text-xs text-text-secondary mt-2 break-words">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                return null;
              })
            ) : (
              <p className="text-text-secondary text-center py-6">
                محتوایی برای این مقاله ثبت نشده است.
              </p>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
