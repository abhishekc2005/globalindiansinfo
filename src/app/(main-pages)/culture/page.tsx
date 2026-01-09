import CategoryPage from "@/components/shared/category-page";
import { postService } from "@/services/posts/posts.service";

export default async function CulturePage() {
  const articles = await postService.getPublishedArticlesByCategory("culture");

  return (
    <CategoryPage
      categorySlug="culture"
      categoryName="Culture"
      description="Exploring the rich heritage, arts, and traditions of the Global Indian community."
      initialArticles={articles as any[]}
    />
  );
}
