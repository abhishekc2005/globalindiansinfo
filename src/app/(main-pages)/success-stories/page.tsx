import CategoryPage from "@/components/shared/category-page";
import { postService } from "@/services/posts/posts.service";

export default async function SuccessStoriesPage() {
  const articles = await postService.getPublishedArticlesByCategory(
    "success-stories"
  );

  return (
    <CategoryPage
      categorySlug="success-stories"
      categoryName="Success Stories"
      description="Inspiring journeys of individuals who have made a mark in their respective fields."
      initialArticles={articles as any[]}
    />
  );
}
