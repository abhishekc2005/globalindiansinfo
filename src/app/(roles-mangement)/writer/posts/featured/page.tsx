import { checkRole } from "@/lib/rbac";
import { UserRole, PostStatus } from "@/generated/client";
import { ArticleService } from "@/services/article.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WriterFeaturedPage() {
  const user = await checkRole([
    UserRole.WRITER,
    UserRole.ADMIN,
    UserRole.EDITOR,
  ]);

  const { articles: featuredArticles } = await ArticleService.getAllArticles(
    1,
    50,
    {
      authorId: user.id,
      isFeatured: true,
    }
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Featured Posts</h1>
      </div>

      <div className="grid gap-4">
        {featuredArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(article.createdAt), "PPP")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      article.status === "PUBLISHED" ? "default" : "secondary"
                    }
                  >
                    {article.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    Featured
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex justify-end">
                <Link href={`/writer/posts/${article.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {featuredArticles.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground mb-2">
              You don't have any featured posts yet.
            </p>
            <p className="text-sm text-muted-foreground">
              You can mark a post as "Featured" when creating or editing it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
