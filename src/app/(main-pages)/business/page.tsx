import CategoryPage from "@/components/shared/category-page";
import { postService } from "@/services/posts/posts.service";

export default async function BusinessPage() {
  const articles = await postService.getPublishedArticlesByCategory("business");

  return (
    <CategoryPage
      categorySlug="business"
      categoryName="Business"
      description="Insights, trends, and success stories from the world of business and entrepreneurship."
      initialArticles={articles as any[]}
    />
  );
}
