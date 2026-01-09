import { Suspense } from "react";
import ListingsClient from "./client-listing-component";
import { Listing } from "@/types/listing";

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

type SearchParams = {
  page?: string;
  search?: string;
  category?: string;
  location?: string;
};

async function getListings(params: SearchParams): Promise<{
  listings: Listing[];
  pagination: PaginationData | null;
  filters: FilterData | null;
}> {
  try {
    const query = new URLSearchParams({
      page: params.page || "1",
      limit: "12",
      search: params.search || "",
      category: params.category === "all" ? "" : (params.category || ""),
      location: params.location === "all" ? "" : (params.location || ""),
    });

    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/proxy-listings?${query.toString()}`, {
      cache: "no-store",
      next: { revalidate: 0 },
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

// Loading component for Suspense fallback
function ListingsLoading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center max-w-4xl mx-auto space-y-4 md:space-y-6">
            <div className="h-6 w-32 bg-muted rounded mx-auto animate-pulse" />
            <div className="h-16 w-3/4 bg-muted rounded mx-auto animate-pulse" />
            <div className="h-6 w-1/2 bg-muted rounded mx-auto animate-pulse" />
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Async wrapper component that fetches data
async function ListingsWithData({ searchParams }: { searchParams: SearchParams }) {
  const data = await getListings(searchParams);
  
  return (
    <ListingsClient
      initialListings={data.listings}
      initialPagination={data.pagination}
      initialFilters={data.filters}
    />
  );
}

// Main page component
export default function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<ListingsLoading />}>
      <ListingsWithData searchParams={searchParams} />
    </Suspense>
  );
}