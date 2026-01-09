import CategoryPage from "@/components/shared/category-page";
import { postService } from "@/services/posts/posts.service";

export default async function DiasporaPage() {
  const articles = await postService.getPublishedArticlesByCategory("diaspora");

  return (
    <CategoryPage
      categorySlug="diaspora"
      categoryName="Diaspora"
      description="Connecting with the Indian diaspora worldwide. Stories of migration, settlement, and community."
      initialArticles={articles as any[]}
    />
  );
}
