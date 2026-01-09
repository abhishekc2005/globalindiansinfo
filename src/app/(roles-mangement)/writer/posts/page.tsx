import { auth } from "@/lib/auth";
import { ArticleService } from "@/services/article.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ArticleItemActions from "../_components/article-item-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function PostsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { articles } = await ArticleService.getAllArticles(1, 50, {
    authorId: session.user.id,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
        <Link href="/writer/posts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {article.title}
                    {article.isFeatured && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Featured
                      </Badge>
                    )}
                  </CardTitle>
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
                  <ArticleItemActions articleId={article.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
        {articles.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">
              You haven't created any posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
