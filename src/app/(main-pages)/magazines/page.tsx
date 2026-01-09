import { getMagazines } from "@/services/magazine";
import MagazineGrid from "./_components/MagazineGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine Archive | Global Indians",
  description: "Explore our collection of Global Indians magazines.",
};

export default async function MagazineArchivePage() {
  const magazines = await getMagazines({
    status: "PUBLISHED",
    take: 5, // LIMIT: Show 5 magazines as requested
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair tracking-tight">
          Global Indians Magazine
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover stories of success, culture, and innovation from the Indian
          diaspora worldwide.
        </p>
      </div>

      {magazines.length > 0 ? (
        <MagazineGrid magazines={magazines} />
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed text-muted-foreground">
          <p className="text-xl font-medium">No magazines found.</p>
          <p className="text-sm mt-2">
            Check back later for our latest issues.
          </p>
        </div>
      )}
    </div>
  );
}
