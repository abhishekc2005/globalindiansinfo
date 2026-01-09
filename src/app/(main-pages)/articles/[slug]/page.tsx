import { ArticleService } from "@/services/article.service";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ImageWithFallback from "@/components/ui/image-with-fallback";
// Custom components removed as we are using native HTML rendering with prose

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch article directly from DB or Service
  // Using DB directly here for speed as Service might need update for slug fetching if not already there
  // Actually ArticleService.getArticleBySlug exists, let's use it.
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        {/* Header */}
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>{article.category?.name}</span>
            <span>•</span>
            <span>{format(new Date(article.createdAt), "MMMM d, yyyy")}</span>
            <span>•</span>
            <span>{article.readMinutes || 5} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            {article.author.image ? (
              <img
                src={article.author.image}
                alt={article.author.name || "Author"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {article.author.name?.charAt(0) || "A"}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">
                {article.author.name}
              </p>
              <p className="text-xs text-muted-foreground">Author</p>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video w-full bg-primary overflow-hidden rounded-xl mb-8">
            <ImageWithFallback
              src={article.coverImageUrl || ""}
              alt={article.title}
              className="object-contain w-full h-full "
            />
          </div>
        </header>

        {/* Content */}
        <div
          className="mdx-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  );
}
