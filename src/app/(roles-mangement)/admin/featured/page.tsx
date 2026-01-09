import { checkRole } from "@/lib/rbac";
import { UserRole, PostStatus } from "@/generated/client";
import { ArticleService } from "@/services/article.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FeaturedToggle } from "../_components/featured-toggle";

export default async function AdminFeaturedPage() {
  await checkRole([UserRole.ADMIN]);

  const { articles: featuredArticles } = await ArticleService.getAllArticles(
    1,
    50,
    { status: PostStatus.PUBLISHED, isFeatured: true }
  );

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Featured Articles</h1>
      </div>

      <div className="grid gap-4">
        {featuredArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {article.author.name} •{" "}
                    {format(new Date(article.createdAt), "PPP")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{article.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground mb-0 line-clamp-2 flex-1 mr-4">
                  {article.excerpt}
                </p>
                <FeaturedToggle
                  articleId={article.id}
                  isFeatured={article.isFeatured}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {featuredArticles.length === 0 && (
          <p className="text-muted-foreground">No featured articles found.</p>
        )}
      </div>
    </main>
  );
}
