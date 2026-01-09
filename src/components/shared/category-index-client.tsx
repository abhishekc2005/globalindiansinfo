"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { FeaturedCarouselResponsive } from "@/components/home/hero-section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatUniversalDate } from "@/utils/date";

// Define Article interface matching what's expected by components
interface Article {
  readMinutes: string;
  id: string;
  title: string;
  excerpt: string;
  category: { name: string; slug: string };
  author: { name: string; avatarUrl?: string };
  readTime: number;
  slug: string;
  publishedAt: string;
  coverImage?: string;
  coverImageUrl?: string;
  content?: string;
  likes: number; // Added missing property
  views: number; // Added missing property
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryIndexClientProps {
  categories: Category[];
  initialArticles: Article[];
}

export default function CategoryIndexClient({
  categories,
  initialArticles,
}: CategoryIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredArticles = useMemo(() => {
    let result = [...initialArticles];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (article) => article.category?.slug === selectedCategory
      );
    }

    // Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialArticles, selectedCategory, searchQuery, sortOrder]);

  console.log("filteredArticles", filteredArticles);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary tracking-tight">
            Explore Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover articles across a wide range of topics. Filter by category,
            search for specific interests, and stay updated with the latest
            news.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Controls Section: Categories, Search, Sort */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className="rounded-full px-6"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.slug)}
                className="rounded-full px-6"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Showing {filteredArticles.length} results
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[150px] gap-2 ml-auto md:ml-0"
                  >
                    {sortOrder === "newest" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    )}
                    {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                    Oldest First
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Categories Featured (Optional: only if "All" is selected and no search) */}
        {selectedCategory === "All" &&
          !searchQuery &&
          filteredArticles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Latest Highlights
              </h2>
              <FeaturedCarouselResponsive items={filteredArticles.slice(0, 5)} />
            </div>
          )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredArticles.map((article) => (
            <Link
              href={`/articles/${article.slug}`}
              key={article.id}
              className="group h-full"
            >
              <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-card">
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={article.coverImageUrl || article.coverImage || ""}
                    alt={article.title}
                    fallbackSrc="/placeholder.svg"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm">
                    {article.category?.name}
                  </Badge>
                </div>

                <CardHeader className="grow space-y-3 ">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatUniversalDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readMinutes || 5} min read</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                 
                </CardHeader>

                <CardFooter className="pt-0 border-t bg-muted/5">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {article.author?.avatarUrl ? (
                        <img
                          src={article.author.avatarUrl}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-foreground/80">
                        {article.author?.name || "Unknown"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-muted-foreground">
              No articles found matching your criteria.
            </h3>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
