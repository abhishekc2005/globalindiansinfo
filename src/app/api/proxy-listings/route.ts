import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";

    const res = await fetch(
      "https://ukbiznetwork.com/api/listings?limit=5000",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch listings" },
        { status: res.status }
      );
    }

    const data = await res.json();
    let listings: any[] = data.listings || [];

    // Extract Metadata (Unique Categories and Locations from ALL listings)
    const allCategories = new Set<string>();
    const allLocations = new Set<string>();

    listings.forEach((listing) => {
      // Extract Categories
      try {
        const cats = JSON.parse(listing.categories || "[]");
        if (Array.isArray(cats)) {
          cats.forEach((c) => {
            if (typeof c === "string") allCategories.add(c.trim());
            // specific parsing if category is object? Assuming string based on usage
          });
        }
      } catch (e) {
        // ignore invalid json
      }

      // Extract Locations
      try {
        const locs = JSON.parse(listing.locations || "[]");
        if (Array.isArray(locs)) {
          locs.forEach((l) => {
            if (typeof l === "string") allLocations.add(l.trim());
          });
        }
      } catch (e) {
        // ignore
      }
      // Also fallback to address city if location json is empty?
      // For now trust the 'locations' field functionality.
    });

    // Filtering
    if (search) {
      listings = listings.filter(
        (l) =>
          l.service_name?.toLowerCase().includes(search) ||
          l.company_name?.toLowerCase().includes(search) ||
          l.service_description?.toLowerCase().includes(search)
      );
    }

    if (category && category !== "all") {
      listings = listings.filter((l) => {
        try {
          const cats = JSON.parse(l.categories || "[]");
          return cats.includes(category);
        } catch {
          return false;
        }
      });
    }

    if (location && location !== "all") {
      listings = listings.filter((l) => {
        try {
          const locs = JSON.parse(l.locations || "[]");
          return locs.includes(location);
        } catch {
          return false;
        }
      });
    }

    // Calculate pagination
    const total = listings.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedListings = listings.slice(startIndex, endIndex);

    return NextResponse.json({
      listings: paginatedListings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      filters: {
        categories: Array.from(allCategories).sort(),
        locations: Array.from(allLocations).sort(),
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
