"use client";
import * as React from "react";
import { FeaturedCarousel } from "./Featuredcarousel";
import { FeaturedCarouselMobile } from "./Featuredcarouselmobile";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Article {
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

export function FeaturedCarouselResponsive({ items }: { items: Article[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return <FeaturedCarouselMobile items={items} />;
  }

  return <FeaturedCarousel items={items} />;
}