import { db } from "@/lib/db";
import { postService } from "@/services/posts/posts.service";
import CategoryIndexClient from "@/components/shared/category-index-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Global Indians",
  description: "Explore all article categories and topics on Global Indians.",
};

export default async function CategoryIndexPage() {
  // Fetch all categories
  const categories = await db.category.findMany({
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
    take: 20, // Reasonable limit
  });

  // Fetch all published articles
  const articles = await postService.getPublishedArticles();

  return (
    <CategoryIndexClient
      categories={categories}
      initialArticles={articles as any[]}
    />
  );
}
