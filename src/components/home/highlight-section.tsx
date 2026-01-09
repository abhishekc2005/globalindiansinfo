"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";

interface Article {
  content: any;
  id: string;
  title: string;
  excerpt: string;
  category: { name: string; slug: string };
  author: { name: string; avatarUrl?: string };
  readTime: number;
  slug: string;
  image?: string;
  likes: number;
  views: number;
  publishedAt: string;
  coverImage?: string;
  coverImageUrl?: string;
}

export function HighlightSection({ items }: { items: Article[] }) {
  if (!items || items.length === 0) return null;

  const mainArticle = items[0];
  const sideArticles = items.slice(1, 5); // Take up to 4 side articles

  const fallbackImage =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600";

  // Helper to get image from content, prioritizing content image over cover image
  const getArticleImage = (article: Article) => {
    // Try to extract first image from content
    if (article.content) {
      const imgMatch = article.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch && imgMatch[1]) return imgMatch[1];
    }

    // Fallback to cover image
    if (article.coverImageUrl || article.coverImage) {
      return article.coverImageUrl || article.coverImage || "";
    }
    return "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* Main Highlight Card */}
      <Link href={`/articles/${mainArticle.slug}`} className="group h-full">
        <Card className="relative overflow-hidden rounded-xl border-none bg-amber-500 py-0 shadow-lg h-full flex flex-col">
          <div className="relative h-64 md:h-auto md:flex-1 w-full min-h-[300px]">
            <ImageWithFallback
              src={getArticleImage(mainArticle)}
              fallbackSrc={fallbackImage}
              alt={mainArticle.title}
              className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          <CardContent className="absolute bottom-0 z-10 p-6 text-white w-full">
            <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary/90">
              {mainArticle.category?.name || "Cover Story"}
            </Badge>

            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
              {mainArticle.title}
            </h3>

            <p className="text-sm md:text-base text-gray-200 line-clamp-2 mb-4 hidden sm:block">
              {mainArticle.excerpt}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {mainArticle.publishedAt}
              </span>
              {mainArticle.author?.name && (
                <span>By {mainArticle.author.name}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Side Cards - Dense List */}
      <div className="flex flex-col gap-4 h-full">
        {sideArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block flex-1"
          >
            <Card className="overflow-hidden rounded-xl py-0 hover:shadow-lg transition-all hover:border-primary/20 h-full">
              <div className="flex gap-4 h-full">
                <div className="relative w-32 md:w-40 shrink-0">
                  <ImageWithFallback
                    src={getArticleImage(article)}
                    fallbackSrc={fallbackImage}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <CardContent className="flex-1 py-3 pr-4 pl-0 flex flex-col justify-center">
                  <div className="mb-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-5 px-2 font-medium bg-muted text-muted-foreground"
                    >
                      {article.category?.name}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h4>

                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{article.publishedAt}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
