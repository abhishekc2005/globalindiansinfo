"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Listing } from "@/types/listing";
import {
  MapPin,
  ExternalLink,
  Star,
  Sparkles,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  FilterX,
} from "lucide-react";
import { ImageWithFallbackNext } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useEffect, useState, useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type FilterData = {
  categories: string[];
  locations: string[];
};

type FetchParams = {
  page: number;
  search: string;
  category: string;
  location: string;
};

async function getListings(params: FetchParams): Promise<{
  listings: Listing[];
  pagination: PaginationData | null;
  filters: FilterData | null;
}> {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      limit: "12",
      search: params.search,
      category: params.category === "all" ? "" : params.category,
      location: params.location === "all" ? "" : params.location,
    });

    const res = await fetch(`/api/proxy-listings?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch listings");
      return { listings: [], pagination: null, filters: null };
    }

    const data = await res.json();
    return {
      listings: data.listings || [],
      pagination: data.pagination || null,
      filters: data.filters || null,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], pagination: null, filters: null };
  }
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <CardHeader>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ListingsClientProps = {
  initialListings: Listing[];
  initialPagination: PaginationData | null;
  initialFilters: FilterData | null;
};

export default function ListingsClient({
  initialListings,
  initialPagination,
  initialFilters,
}: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get initial values from URL or defaults
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialLocation = searchParams.get("location") || "all";

  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(
    initialPagination
  );

  // Local state for inputs to allow smooth typing before syncing to URL
  const [localSearch, setLocalSearch] = useState(initialSearch);

  // Available Options (persisted across renders)
  const [availableFilters, setAvailableFilters] = useState<FilterData>(
    initialFilters || {
      categories: [],
      locations: [],
    }
  );

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== initialSearch) {
        updateUrl("search", localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, initialSearch]);

  // Update URL helper with transition
  const updateUrl = useCallback(
    (key: string, value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!value || value === "all") {
        current.delete(key);
      } else {
        current.set(key, value);
      }

      // Reset to page 1 on filter change (except search which is handled separately or if key is 'page')
      if (key !== "page") {
        current.set("page", "1");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";

      // Use startTransition for smoother navigation
      startTransition(() => {
        router.push(`${pathname}${query}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await getListings({
      page: initialPage,
      search: initialSearch,
      category: initialCategory,
      location: initialLocation,
    });

    setListings(data.listings);
    setPagination(data.pagination);

    if (data.filters) {
      setAvailableFilters((prev) => {
        // Only set if empty to avoid dropdown flicker/resetting while navigating
        if (prev.categories.length === 0) return data.filters!;
        return prev;
      });
    }
    setLoading(false);
  }, [initialPage, initialSearch, initialCategory, initialLocation]);

  // Fetch new data when URL params change
  useEffect(() => {
    // Skip initial render since we already have data from server
    if (
      listings.length === 0 ||
      initialPage !== 1 ||
      initialSearch !== "" ||
      initialCategory !== "all" ||
      initialLocation !== "all"
    ) {
      fetchData();
    }
  }, [fetchData]);

  // Sync local search state if URL changes externally (e.g. back button)
  useEffect(() => {
    setLocalSearch(initialSearch);
  }, [initialSearch]);

  const handleNext = () => {
    if (pagination && initialPage < pagination.totalPages) {
      updateUrl("page", String(initialPage + 1));
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (initialPage > 1) {
      updateUrl("page", String(initialPage - 1));
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handlePageClick = (p: number) => {
    updateUrl("page", String(p));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const clearFilters = () => {
    setLocalSearch("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center max-w-4xl mx-auto space-y-4 md:space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Discover Excellence
            </Badge>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">
              Premium UK{" "}
              <span className="text-primary underline ">
                <Link href="https://ukbiznetwork.com">Businesses</Link>
              </span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with top-rated companies and services across the United
              Kingdom.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="container mx-auto px-4 -mt-8 mb-8 relative z-10">
        <Card className="shadow-lg border-muted">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                className="pl-9"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Category Filter */}
            <Select
              value={initialCategory}
              onValueChange={(value) => updateUrl("category", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableFilters.categories.map((cat, i) => (
                  <SelectItem key={i} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select
              value={initialLocation}
              onValueChange={(value) => updateUrl("location", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {availableFilters.locations.map((loc, i) => (
                  <SelectItem key={i} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
              disabled={
                isPending ||
                (!localSearch &&
                  initialCategory === "all" &&
                  initialLocation === "all")
              }
            >
              <FilterX className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Listings Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading || isPending
              ? "Loading..."
              : pagination
              ? `Showing ${pagination.total} results`
              : "0 results"}
          </p>
        </div>

        {loading || isPending ? (
          <LoadingGrid />
        ) : listings.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">No matches found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear all filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {listings.map((listing) => {
                let images: string[] = [];
                try {
                  images = JSON.parse(listing.images || "[]");
                } catch (e) {
                  // ignore
                }

                const mainImage = images.length > 0 ? images[0] : null;

                return (
                  <Card
                    key={listing.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-muted shrink-0">
                      {mainImage ? (
                        <ImageWithFallbackNext
                          src={mainImage}
                          alt={listing.service_name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}

                      {listing.featured === 1 && (
                        <Badge className="absolute top-3 right-3">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <CardHeader>
                      <Badge variant="outline" className="w-fit mb-2">
                        {listing.company_name}
                      </Badge>

                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                        {listing.service_name}
                      </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardFooter className="mt-auto pt-4">
                      <Button className="w-full" variant="secondary" asChild>
                        <Link
                          href={listing.website || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={initialPage === 1 || isPending}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      // Simple logic to show a window of pages around current
                      let p = initialPage;
                      if (pagination.totalPages <= 5) {
                        p = i + 1;
                      } else if (initialPage <= 3) {
                        p = i + 1;
                      } else if (initialPage >= pagination.totalPages - 2) {
                        p = pagination.totalPages - 4 + i;
                      } else {
                        p = initialPage - 2 + i;
                      }

                      return (
                        <Button
                          key={p}
                          variant={initialPage === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageClick(p)}
                          className="w-9 h-9"
                          disabled={isPending}
                        >
                          {p}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={initialPage === pagination.totalPages || isPending}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}