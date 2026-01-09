import CategoryPage from "@/components/shared/category-page";
import { postService } from "@/services/posts/posts.service";

export default async function NewsPage() {
  const articles = await postService.getPublishedArticlesByCategory("news");

  return (
    <CategoryPage
      categorySlug="news"
      categoryName="News"
      description="Stay updated with the latest news and headlines from around the world, focusing on the Global Indian community."
      initialArticles={articles as any[]}
    />
  );
}
