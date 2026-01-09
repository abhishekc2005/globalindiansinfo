"use client";
import { useState, useEffect } from "react";

import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { FeaturedCarouselResponsive } from "./hero-section";
import SecondSection from "./second-section";

import WhatsappCommunity from "./whatsapp-community";
import { DidYouKnow } from "./did-you-know";
import { WorldInNumbers } from "./world-in-numbers";
interface FeaturedArticle {
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
}
interface GlobalIndian {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarUrl?: string;
  story: string;
  category: string;
}
export default function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedArticle[]>(
    []
  );
  const [publishedArticles, setPublishedArticles] = useState<FeaturedArticle[]>(
    []
  );
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  useEffect(() => {
    fetchArticles(category);
  }, [category]);
  const fetchArticles = async (category: string) => {
    setIsLoading(true);
    try {
      const url = category
        ? `/api/posts/articles?category=${category}`
        : `/api/posts/articles`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch articles");
      console.log(data);
      setPublishedArticles(data.posts || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch("/api/posts/articles/featured");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setFeaturedArticles(data.posts);
    } catch (error) {
      console.error("Failed to load featured carousel:", error);
    }
  };

  /* Cover Stories */
  const [coverStories, setCoverStories] = useState<FeaturedArticle[]>([]);

  useEffect(() => {
    fetchCoverStories();
  }, []);

  const fetchCoverStories = async () => {
    try {
      // Fetch specifically for the "Cover Story" category (slug: global-indian-exclusive)
      const res = await fetch(
        "/api/posts/articles?category=global-indian-exclusive"
      );
      const data = await res.json();
      if (res.ok) {
        setCoverStories(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch cover stories:", error);
    }
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4"></div>
      {/* Separator removed as Header has border-b */}

      {/* Hero Section */}

      <section className="py-0">
        <FeaturedCarouselResponsive items={featuredArticles} />
      </section>
      <div className="container mx-auto px-4">
        {/* Cover Stories */}
        <SecondSection items={coverStories.slice(0, 5)} />

        {/* Whatsapp Community CTA */}
        <WhatsappCommunity />

        {/* Did You Know? */}
        <DidYouKnow />

        {/* World In Numbers */}
        <WorldInNumbers />
      </div>
    </div>
  );
}
